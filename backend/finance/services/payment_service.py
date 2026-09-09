import logging
import uuid
from decimal import Decimal
from typing import Tuple, Optional, Dict
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model

from finance.models import PaymentModel, TransactionModel, RefundModel
from finance.constants import PaymentStatus, TransactionStatus
from finance.services.zarinpal_service import zarinpal_service
from clinic.models import AppointmentModel
from clinic.constants import AppointmentStatus

User = get_user_model()
logger = logging.getLogger("payment_service")


class PaymentService:
    """
    Service for handling payment operations integrated with appointments.
    """

    @staticmethod
    @transaction.atomic
    def create_payment_for_appointment(
        appointment: AppointmentModel,
        callback_url: str,
    ) -> Tuple[bool, Optional[PaymentModel], Optional[TransactionModel], Optional[str]]:
        """
        Create payment and transaction for an appointment.

        Args:
            appointment: AppointmentModel instance
            callback_url: Payment callback URL

        Returns:
            Tuple of (success, payment, transaction, payment_url)
        """
        try:
            # Check if payment already exists
            if hasattr(appointment, 'payment') and appointment.payment:
                logger.warning(f"Payment already exists for appointment {appointment.id}")
                return False, None, None, None

            # Create payment record
            payment = PaymentModel.objects.create(
                appointment=appointment,
                user=appointment.patient,
                amount_irr=appointment.price_irr,
                idempotency_key=str(uuid.uuid4()),
            )

            # Generate a placeholder authority (36 characters exactly)
            # Format: S{32-char-hex}000
            # S + 32 chars UUID + 3 zeros = 36 chars total
            # This will be replaced by ZarinPal's real authority
            transaction_id = uuid.uuid4()
            placeholder_authority = f"S{str(transaction_id).replace('-', '')}000"
            
            # Create transaction record with placeholder authority
            transaction = TransactionModel.objects.create(
                id=transaction_id,
                user=appointment.patient,
                amount=int(appointment.price_irr),  # Convert to int for ZarinPal
                currency="IRR",
                description=f"رزرو نوبت دکتر {appointment.doctor.full_name} در تاریخ {appointment.appointment_date}",
                callback_url=callback_url,
                authority=placeholder_authority,  # Placeholder, will be updated by ZarinPal
                mobile=getattr(appointment.patient, 'phone_number', None),
                email=getattr(appointment.patient, 'email', None),
            )

            # Initiate payment with ZarinPal (will update authority)
            success, authority, payment_url = zarinpal_service.initiate_payment(
                transaction=transaction,
                callback_url=callback_url,
                mobile=transaction.mobile,
                email=transaction.email,
            )

            if success:
                logger.info(f"Payment created for appointment {appointment.id}: {payment.id}")
                return True, payment, transaction, payment_url
            else:
                # Clean up on failure
                payment.delete()
                transaction.delete()
                logger.error(f"Payment initiation failed for appointment {appointment.id}")
                return False, None, None, None

        except Exception as e:
            logger.error(f"Error creating payment for appointment {appointment.id}: {str(e)}")
            return False, None, None, None

    @staticmethod
    @transaction.atomic
    def verify_payment_and_confirm_appointment(
        authority: str,
    ) -> Tuple[bool, Optional[AppointmentModel], Optional[Dict]]:
        """
        Verify payment and confirm appointment.
        If payment fails, the appointment is cancelled.

        Args:
            authority: Payment authority code

        Returns:
            Tuple of (success, appointment, verification_data)
        """
        try:
            # Get transaction
            logger.info(f"Getting transaction for authority: {authority}")
            transaction = TransactionModel.objects.select_for_update().get(
                authority=authority
            )

            if transaction.status == TransactionStatus.PAID:
                logger.warning(f"Transaction {authority} already verified")
                # Get the appointment for already paid transaction
                try:
                    payment = PaymentModel.objects.get(
                        appointment__patient=transaction.user,
                        amount_irr=Decimal(str(transaction.amount)),
                        status=PaymentStatus.SUCCEEDED
                    )
                    return True, payment.appointment, None
                except PaymentModel.DoesNotExist:
                    return False, None, None

            # Verify payment with ZarinPal
            logger.info(f"Verifying payment with ZarinPal for authority: {authority}, amount: {transaction.amount}")
            success, verification_data = zarinpal_service.verify_payment(
                authority=authority,
                amount=transaction.amount
            )

            logger.info(f"ZarinPal verification result: success={success}, data={verification_data}")

            if success:
                # Update transaction
                transaction.status = TransactionStatus.PAID
                transaction.ref_id = verification_data.get("ref_id") if verification_data else None
                transaction.card_pan = verification_data.get("card_pan") if verification_data else None
                transaction.fee = verification_data.get("fee", 0) if verification_data else 0
                transaction.save()

                # Update payment
                logger.info(f"Finding payment for user: {transaction.user}, amount: {transaction.amount}")
                payment = PaymentModel.objects.select_for_update().get(
                    appointment__patient=transaction.user,
                    amount_irr=Decimal(str(transaction.amount)),
                    status=PaymentStatus.PENDING
                )
                payment.status = PaymentStatus.SUCCEEDED
                payment.provider_payment_id = transaction.ref_id
                payment.payment_method_last4 = transaction.card_pan[-4:] if transaction.card_pan else None
                payment.paid_at = timezone.now()
                payment.save()

                # Confirm appointment
                appointment = payment.appointment
                appointment.status = AppointmentStatus.CONFIRMED
                appointment.confirmed_at = timezone.now()
                appointment.save()

                logger.info(f"Payment verified and appointment confirmed: {appointment.id}")
                return True, appointment, verification_data
            else:
                # Payment verification failed - update transaction and cancel appointment
                transaction.status = TransactionStatus.FAILED
                transaction.save()

                # Find and cancel the appointment
                try:
                    logger.info(f"Payment failed, looking for appointment to cancel for user: {transaction.user}")
                    payment = PaymentModel.objects.select_for_update().get(
                        appointment__patient=transaction.user,
                        amount_irr=Decimal(str(transaction.amount)),
                        status=PaymentStatus.PENDING
                    )
                    
                    # Mark payment as failed
                    payment.status = PaymentStatus.FAILED
                    payment.save()
                    
                    # Cancel the appointment
                    appointment = payment.appointment
                    if appointment.status == AppointmentStatus.PENDING:
                        appointment.status = AppointmentStatus.CANCELLED
                        appointment.cancelled_at = timezone.now()
                        appointment.cancellation_reason = "Payment failed"
                        appointment.save()
                        logger.info(f"Appointment {appointment.id} cancelled due to payment failure")
                    
                except PaymentModel.DoesNotExist:
                    logger.warning(f"No pending payment found for failed transaction {authority}")

                logger.error(f"Payment verification failed for authority: {authority}")
                return False, None, None

        except TransactionModel.DoesNotExist:
            logger.error(f"Transaction not found for authority: {authority}")
            return False, None, None
        except Exception as e:
            logger.error(f"Error verifying payment for authority {authority}: {str(e)}", exc_info=True)
            return False, None, None

    @staticmethod
    @transaction.atomic
    def process_refund(
        payment: PaymentModel,
        amount_irr: Decimal,
        reason: str,
        admin_user: User,
    ) -> Tuple[bool, Optional[RefundModel]]:
        """
        Process refund for a payment.

        Args:
            payment: PaymentModel instance
            amount_irr: Refund amount
            reason: Refund reason
            admin_user: Admin user initiating refund

        Returns:
            Tuple of (success, refund)
        """
        try:
            if not payment.can_be_refunded:
                logger.error(f"Payment {payment.id} cannot be refunded")
                return False, None

            if amount_irr > payment.remaining_refundable_amount:
                logger.error(f"Refund amount {amount_irr} exceeds remaining refundable amount")
                return False, None

            # Create refund record
            refund = RefundModel.objects.create(
                payment=payment,
                amount_irr=amount_irr,
                reason=reason,
                created_by=admin_user,
            )

            # Process refund with ZarinPal
            success, refund_id = zarinpal_service.process_refund(
                session_id=payment.provider_payment_id or str(payment.id),
                amount=int(amount_irr),
                description=reason,
            )

            if success:
                refund.status = PaymentStatus.SUCCEEDED
                refund.provider_refund_id = refund_id
                refund.processed_at = timezone.now()
                refund.save()

                # Update payment
                payment.refunded_amount_irr += amount_irr
                if payment.refunded_amount_irr >= payment.amount_irr:
                    payment.status = PaymentStatus.REFUNDED
                    payment.refunded_at = timezone.now()
                else:
                    payment.status = PaymentStatus.PARTIALLY_REFUNDED
                payment.save()

                logger.info(f"Refund processed successfully: {refund.id}")
                return True, refund
            else:
                refund.status = PaymentStatus.FAILED
                refund.save()
                logger.error(f"Refund processing failed: {refund.id}")
                return False, refund

        except Exception as e:
            logger.error(f"Error processing refund: {str(e)}")
            return False, None
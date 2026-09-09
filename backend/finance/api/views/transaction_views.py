import logging
from django.conf import settings
from django.shortcuts import get_object_or_404, redirect
from django.http import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from finance.models import TransactionModel, TransactionStatus
from finance.services import PaymentService
from finance.api.serializers import (
    TransactionSerializer,
    TransactionCreateSerializer,
    PaymentInitiateSerializer,
    PaymentVerifySerializer,
    PaymentVerifyResponseSerializer,
)

logger = logging.getLogger("finance_api")


class TransactionListView(ListAPIView):
    """
    API view for listing user transactions.
    """

    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    def get_queryset(self):
        """
        Return transactions for the current user.
        """
        return TransactionModel.objects.filter(user=self.request.user)


class TransactionDetailView(RetrieveAPIView):
    """
    API view for retrieving transaction details.
    """

    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    def get_queryset(self):
        """
        Return transactions for the current user.
        """
        return TransactionModel.objects.filter(user=self.request.user)


class PaymentInitiateView(APIView):
    """
    API view for initiating payments with Zarinpal.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        """
        Create a transaction and initiate payment with Zarinpal.
        """
        serializer = TransactionCreateSerializer(
            data=request.data, context={"request": request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create transaction
            transaction = serializer.save()

            # Initiate payment with ZarinPal
            from finance.services.zarinpal_service import zarinpal_service
            success, authority, payment_url = zarinpal_service.initiate_payment(
                transaction=transaction,
                callback_url=transaction.callback_url,
                mobile=transaction.mobile,
                email=transaction.email,
            )

            if not success:
                transaction.delete()  # Clean up failed transaction
                return Response(
                    {"error": "Payment initiation failed"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            logger.info(
                f"Payment initiated for user {request.user.phone_number}, "
                f"transaction {transaction.id}, authority {authority}"
            )

            response_serializer = PaymentInitiateSerializer(
                {"authority": authority, "payment_url": payment_url}
            )

            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Payment initiation failed: {str(e)}")
            return Response(
                {"error": "Payment initiation failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PaymentVerifyView(APIView):
    """
    API view for verifying payments with Zarinpal.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        """
        Verify payment status with Zarinpal.
        """
        serializer = PaymentVerifySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        authority = serializer.validated_data["authority"]  # type: ignore

        try:
            # Get transaction by authority
            transaction = get_object_or_404(
                TransactionModel, authority=authority, user=request.user
            )

            # Verify payment with ZarinPal
            from finance.services.zarinpal_service import zarinpal_service
            success, verification_data = zarinpal_service.verify_payment(
                authority=authority,
                amount=transaction.amount
            )

            logger.info(
                f"Payment verification requested for transaction {transaction.id}, "
                f"authority {authority}, success: {success}"
            )

            if success:
                transaction.status = TransactionStatus.PAID
                if verification_data:
                    transaction.ref_id = verification_data.get("ref_id")
                    transaction.card_pan = verification_data.get("card_pan")
                    transaction.fee = verification_data.get("fee", 0)
                transaction.card_pan = card_pan
                transaction.fee = fee
                transaction.save()

                response_data = {
                    "success": True,
                    "ref_id": ref_id,
                    "card_pan": card_pan,
                    "fee": fee,
                    "message": "Payment verified successfully",
                }
            else:
                transaction.status = TransactionStatus.FAILED
                transaction.save()

                response_data = {
                    "success": False,
                    "message": "Payment verification failed",
                }

            response_serializer = PaymentVerifyResponseSerializer(response_data)
            return Response(response_serializer.data)

        except Http404:
            return Response(
                {"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND
            )
            return Response(
                {"error": "Payment verification failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PaymentCallbackView(APIView):
    """
    API view for handling ZarinPal payment callbacks and verifying payments.
    """

    permission_classes = []  # Allow unauthenticated access for callbacks
    throttle_scope = "payment_callback"
    throttle_classes = [ScopedRateThrottle]

    def get(self, request):
        """
        Handle ZarinPal callback (GET request with query parameters).
        Verifies payment and redirects user to frontend success/failure page.
        """
        authority = request.query_params.get("Authority")
        status_param = request.query_params.get("Status")

        logger.info(f"Payment callback received: Authority={authority}, Status={status_param}")

        if not authority:
            logger.error("Payment callback received without authority")
            # Redirect to frontend failure page
            frontend_url = settings.FRONTEND_URL
            return redirect(f"{frontend_url}/user/payment/failure?error=missing_authority")

        try:
            # Verify payment and confirm appointment
            logger.info(f"Attempting to verify payment for authority: {authority}")
            success, appointment, verification_data = PaymentService.verify_payment_and_confirm_appointment(
                authority=authority
            )

            logger.info(f"Payment verification result: success={success}, appointment={appointment}, data={verification_data}")

            frontend_url = settings.FRONTEND_URL

            if success and appointment:
                # Redirect to frontend success page with appointment details
                logger.info(f"Payment successful, redirecting to success page for appointment {appointment.id}")
                success_url = f"{frontend_url}/user/payment/success?appointment_id={appointment.id}&authority={authority}&status=OK"
                return redirect(success_url)
            else:
                # Redirect to frontend failure page
                logger.warning(f"Payment verification failed or no appointment found for authority: {authority}")
                failure_url = f"{frontend_url}/user/payment/failure?authority={authority}&status={status_param or 'NOK'}"
                return redirect(failure_url)

        except Exception as e:
            logger.error(f"Payment callback error for authority {authority}: {str(e)}", exc_info=True)
            frontend_url = settings.FRONTEND_URL
            return redirect(f"{frontend_url}/user/payment/failure?authority={authority}&error=processing_failed")


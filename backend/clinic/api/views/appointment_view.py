import logging
from datetime import date

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle

from accounts.models import DoctorProfileModel

from clinic.models import AppointmentModel
from clinic.constants import AppointmentStatus
from clinic.services import AvailabilityService, BookingService
from finance.services import PaymentService
from clinic.api.serializers import (
    AppointmentSerializer,
    AppointmentCreateSerializer,
    AppointmentCancelSerializer,
)
from clinic.services.exceptions import (
    DoubleBookingError,
    InvalidTimeSlotError,
    SlotNotAvailableError,
)


logger = logging.getLogger("clinic_api")


class AppointmentViewSet(ModelViewSet):
    """
    ViewSet for managing appointments.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    queryset = AppointmentModel.objects.all()
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        """Filter queryset based on user role."""
        user = self.request.user

        # Admin sees all
        if user.is_staff:
            return AppointmentModel.objects.select_related(
                "doctor__user", "patient"
            ).prefetch_related("payment")

        # Doctor sees their appointments
        if hasattr(user, "doctor_profile"):
            return (
                AppointmentModel.objects.filter(
                    doctor=user.doctor_profile  # type: ignore
                )
                .select_related("doctor__user", "patient")
                .prefetch_related("payment")
            )

        # Patient sees their appointments
        return (
            AppointmentModel.objects.filter(patient=user)
            .select_related("doctor__user", "patient")
            .prefetch_related("payment")
        )

    @action(detail=False, methods=["post"])
    def book(self, request: Request):
        """
        Book an appointment and create payment intent.

        This endpoint:
        1. Creates the appointment with PENDING status
        2. Creates a Stripe payment intent
        3. Returns payment client secret for frontend

        Request body:
        {
            "doctor_id": "uuid",
            "appointment_date": "YYYY-MM-DD",
            "start_time": "HH:MM:SS",
            "end_time": "HH:MM:SS",
            "appointment_type": "consultation",
            "patient_notes": "..."
        }
        """
        serializer = AppointmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        doctor = DoctorProfileModel.objects.get(id=data["doctor_id"])  # type: ignore
        patient = request.user

        # Get slot details to determine price
        slots = AvailabilityService.get_available_slots(
            doctor, data["appointment_date"], data["appointment_date"]  # type: ignore
        )

        # Find matching slot
        matching_slot = None
        for slot in slots:
            if (
                slot["start_time"] == data["start_time"]  # type: ignore
                and slot["end_time"] == data["end_time"]  # type: ignore
                and slot["is_available"]
            ):
                matching_slot = slot
                break

        if not matching_slot:
            return Response(
                {"error": "This time slot is not available"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Create appointment with concurrency safety
            appointment = BookingService.create_booking(
                doctor=doctor,
                patient=patient,
                appointment_date=data["appointment_date"],  # type: ignore
                start_time=data["start_time"],  # type: ignore
                end_time=data["end_time"],  # type: ignore
                price_irr=matching_slot["price_irr"],
                appointment_type=data.get("appointment_type", "consultation"),  # type: ignore
                patient_notes=data.get("patient_notes", ""),  # type: ignore
            )

            # Create payment for the appointment
            callback_url = request.build_absolute_uri("/api/v1/finance/payments/callback/")
            success, payment, transaction, payment_url = PaymentService.create_payment_for_appointment(
                appointment=appointment,
                callback_url=callback_url,
            )

            if not success:
                # If payment creation fails, cancel the appointment
                BookingService.cancel_appointment(str(appointment.id), "Payment creation failed")
                return Response(
                    {"error": "Failed to create payment. Please try again."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(
                {
                    "appointment": AppointmentSerializer(appointment).data,
                    "payment": {
                        "id": str(payment.id),
                        "transaction_id": str(transaction.id),
                        "authority": transaction.authority,
                        "payment_url": payment_url,
                        "amount_irr": str(payment.amount_irr),
                        "status": payment.status,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except (SlotNotAvailableError, DoubleBookingError, InvalidTimeSlotError) as e:
            logger.warning(f"Booking error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Payment error: {e}")
            return Response(
                {"error": "Payment processing failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        """
        Cancel an appointment.

        Request body:
        {
            "reason": "Cancellation reason"
        }
        """
        appointment = self.get_object()
        user = request.user

        # Check permissions
        if not (
            user.is_staff
            or user == appointment.patient
            or (
                hasattr(user, "doctor_profile")
                and user.doctor_profile == appointment.doctor
            )
        ):
            return Response(
                {"error": "You do not have permission to cancel this appointment"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AppointmentCancelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            cancelled_appointment = BookingService.cancel_appointment(
                str(appointment.id), reason=serializer.validated_data.get("reason", "")
            )

            return Response(AppointmentSerializer(cancelled_appointment).data)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def upcoming(self, request):
        """Get upcoming appointments for current user."""
        user = request.user

        if hasattr(user, "doctor_profile"):
            appointments = (
                AppointmentModel.objects.filter(
                    doctor=user.doctor_profile,
                    status=AppointmentStatus.CONFIRMED,
                    appointment_date__gte=date.today(),
                )
                .select_related("doctor__user", "patient")
                .order_by("appointment_date", "start_time")
            )
        else:
            appointments = (
                AppointmentModel.objects.filter(
                    patient=user,
                    status=AppointmentStatus.CONFIRMED,
                    appointment_date__gte=date.today(),
                )
                .select_related("doctor__user", "patient")
                .order_by("appointment_date", "start_time")
            )

        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

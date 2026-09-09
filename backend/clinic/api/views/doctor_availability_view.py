import logging
from datetime import date, timedelta

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle

from clinic.services import AvailabilityService
from accounts.models import DoctorProfileModel
from clinic.api.serializers import AvailableSlotSerializer


logger = logging.getLogger("clinic_api")


class DoctorAvailabilityViewSet(ViewSet):
    """
    Public endpoint for browsing doctor availability.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    @action(detail=True, methods=["get"])
    def slots(self, request: Request, pk=None):
        """
        Get available slots for a doctor.

        Query params:
            - start_date: Start date (default: today)
            - end_date: End date (default: start_date + 30 days)
        """
        doctor = get_object_or_404(DoctorProfileModel, pk=pk)

        # Parse query parameters
        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")

        try:
            if start_date_str:
                start_date = date.fromisoformat(start_date_str)
            else:
                start_date = date.today()

            if end_date_str:
                end_date = date.fromisoformat(end_date_str)
            else:
                end_date = start_date + timedelta(days=30)

            # Validate date range
            if end_date < start_date:
                return Response(
                    {"error": "end_date must be after start_date"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if (end_date - start_date).days > 90:
                return Response(
                    {"error": "Date range cannot exceed 90 days"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except ValueError as e:
            return Response(
                {"error": f"Invalid date format: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get available slots
        slots = AvailabilityService.get_available_slots(doctor, start_date, end_date)

        serializer = AvailableSlotSerializer(slots, many=True)

        return Response(
            {
                "doctor_id": str(doctor.id),
                "doctor_name": doctor.full_name,
                "start_date": start_date,
                "end_date": end_date,
                "slots": serializer.data,
            }
        )

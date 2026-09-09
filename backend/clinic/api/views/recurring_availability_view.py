import logging

# from rest_framework import status
# from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle

from clinic.models import RecurringAvailabilityModel
from clinic.api.serializers import RecurringAvailabilitySerializer


logger = logging.getLogger("clinic_api")


class RecurringAvailabilityViewSet(ModelViewSet):
    """
    ViewSet for managing recurring availability.
    Only accessible by doctors and admins.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    queryset = RecurringAvailabilityModel.objects.all()
    serializer_class = RecurringAvailabilitySerializer

    def get_queryset(self):
        """Filter queryset based on user role."""
        user = self.request.user

        # Admin sees all
        if user.is_staff:
            return RecurringAvailabilityModel.objects.select_related("doctor__user")

        # Doctor sees only their own
        if hasattr(user, "doctor_profile"):
            return RecurringAvailabilityModel.objects.filter(
                doctor=user.doctor_profile  # type: ignore
            ).select_related("doctor__user")

        # Regular users cannot access this endpoint
        return RecurringAvailabilityModel.objects.none()

    def perform_create(self, serializer):
        """Ensure doctor is set correctly on create."""
        user = self.request.user

        if user.is_staff:
            # Admin can create for any doctor
            serializer.save()
        elif hasattr(user, "doctor_profile"):
            # Doctor creates for themselves
            serializer.save(doctor=user.doctor_profile)  # type: ignore
        else:
            # Regular users cannot create
            raise PermissionError("Only doctors can create availability")

    # def create(self, request, *args, **kwargs):
    #     logger.debug("Incoming data: %s", request.data)

    #     serializer = self.get_serializer(data=request.data)
    #     if serializer.is_valid():
    #         self.perform_create(serializer)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     else:
    #         # Log the errors
    #         logger.error("Serializer errors: %s", serializer.errors)
    #         # Also return the errors to the client
    #         return Response(
    #             {"success": False, "errors": serializer.errors},
    #             status=status.HTTP_400_BAD_REQUEST,
    #         )

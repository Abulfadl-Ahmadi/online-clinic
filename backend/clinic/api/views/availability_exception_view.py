import logging

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle

from clinic.models import AvailabilityExceptionModel
from clinic.api.serializers import AvailabilityExceptionSerializer


logger = logging.getLogger("clinic_api")


class AvailabilityExceptionViewSet(ModelViewSet):
    """
    ViewSet for managing availability exceptions.
    Only accessible by doctors and admins.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    queryset = AvailabilityExceptionModel.objects.all()
    serializer_class = AvailabilityExceptionSerializer

    def get_queryset(self):
        """Filter queryset based on user role."""
        user = self.request.user

        # Admin sees all
        if user.is_staff:
            return AvailabilityExceptionModel.objects.select_related("doctor__user")

        # Doctor sees only their own
        if hasattr(user, "doctor_profile"):
            return AvailabilityExceptionModel.objects.filter(
                doctor=user.doctor_profile  # type: ignore
            ).select_related("doctor__user")

        # Regular users cannot access this endpoint
        return AvailabilityExceptionModel.objects.none()

    def perform_create(self, serializer):
        """Ensure doctor is set correctly on create."""
        user = self.request.user

        # Admin can create for any doctor
        if user.is_staff:
            serializer.save()

        # Doctor creates for themselves
        elif hasattr(user, "doctor_profile"):
            serializer.save(doctor=user.doctor_profile)  # type: ignore
        # Regular users cannot create
        else:
            raise PermissionError("Only doctors can create availability exceptions")

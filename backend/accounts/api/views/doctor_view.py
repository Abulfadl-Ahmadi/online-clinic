from rest_framework.decorators import action
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.permissions import IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend

from accounts.models import DoctorProfileModel
from accounts.api.serializers import DoctorProfileSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Doctor management.
    List/Retrieve: Public
    Create/Update/Delete: Admin only
    """

    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    queryset = DoctorProfileModel.objects.all()
    serializer_class = DoctorProfileSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["is_accepting_patients", "is_verified"]
    search_fields = ["user__profile__first_name", "user__profile__last_name", "bio"]
    ordering_fields = ["years_of_experience", "default_price_irr", "created_at"]

    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Get doctors with related data."""
        return (
            DoctorProfileModel.objects.select_related("user", "user__profile")
            .prefetch_related("specializations")
            .filter(is_verified=True, user__status="active")
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def verify(self, request, pk=None):
        """Verify a doctor (admin only)."""
        doctor = self.get_object()
        doctor.is_verified = True
        doctor.save(update_fields=["is_verified", "updated_at"])

        serializer = self.get_serializer(doctor)
        return Response(serializer.data)

from rest_framework import viewsets, filters
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.permissions import IsAdminUser, AllowAny

from accounts.models import SpecializationModel
from accounts.api.serializers import SpecializationSerializer


class SpecializationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Specialization management.
    List/Retrieve: Public
    Create/Update/Delete: Admin only
    """

    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    queryset = SpecializationModel.objects.all()
    serializer_class = SpecializationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]

    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

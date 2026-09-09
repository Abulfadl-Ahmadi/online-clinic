import logging
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.generics import RetrieveUpdateAPIView

from accounts.api.serializers import UserSerializer

logger = logging.getLogger("user_api")


class UserAPIView(RetrieveUpdateAPIView):
    """OPTIMIZED API endpoint for user profile"""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "put", "patch"]

    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    def get(self, request: Request, *args, **kwargs):
        logger.info(f"User {request.user.phone_number} requested their info")
        return super().get(request, *args, **kwargs)

    def put(self, request: Request, *args, **kwargs):
        logger.info(f"User {request.user.phone_number} updated their info")
        return super().put(request, *args, **kwargs)

    def patch(self, request: Request, *args, **kwargs):
        logger.info(f"User {request.user.phone_number} updated their info")
        return super().patch(request, *args, **kwargs)

    def get_object(self):
        return self.request.user

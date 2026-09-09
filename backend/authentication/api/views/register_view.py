import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle

from authentication.api.serializers import RegisterUpdateSerializer

logger = logging.getLogger("user_api")


class RegisterUpdateView(APIView):
    """
    Allows authenticated users to update their profile and settings.
    PATCH /authentication/register/
    """

    http_method_names = ["patch"]
    permission_classes = [IsAuthenticated]

    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]

    def patch(self, request: Request) -> Response:
        user = request.user
        serializer = RegisterUpdateSerializer(
            instance=user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info(
            f"User {user.phone_number} updated profile information (RegisterUpdateView)."
        )

        return Response(
            {
                "message": "Profile updated successfully.",
            },
            status=status.HTTP_200_OK,
        )

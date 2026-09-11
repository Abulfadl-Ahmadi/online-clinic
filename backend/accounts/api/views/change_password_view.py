import logging
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle

from accounts.api.serializers import ChangePasswordSerializer

logger = logging.getLogger("accounts_api")


class ChangePasswordAPIView(APIView):
    """
    API endpoint for changing authenticated user's password.
    Requires current password, new password, and confirmation of new password.
    """

    permission_classes = [IsAuthenticated]
    throttle_scope = "user"
    throttle_classes = [ScopedRateThrottle]
    http_method_names = ["post", "put"]

    def post(self, request: Request, *args, **kwargs):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            logger.info(
                f"User {request.user.phone_number} successfully changed their password"
            )
            return Response(
                {
                    "success": True,
                    "message": "رمز عبور با موفقیت تغییر یافت.",
                },
                status=status.HTTP_200_OK,
            )

        # Extract primary error message
        first_error = "اطلاعات وارد شده معتبر نیست."
        errors = serializer.errors
        if "message" in errors:
            first_error = (
                errors["message"][0]
                if isinstance(errors["message"], list)
                else str(errors["message"])
            )
        else:
            for field, field_errors in errors.items():
                if isinstance(field_errors, list) and field_errors:
                    first_error = field_errors[0]
                    break
                elif isinstance(field_errors, str):
                    first_error = field_errors
                    break

        error_response = {
            "success": False,
            "message": first_error,
            "errors": errors,
        }
        logger.warning(
            f"User {request.user.phone_number} failed to change password: {first_error}"
        )
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: Request, *args, **kwargs):
        return self.post(request, *args, **kwargs)

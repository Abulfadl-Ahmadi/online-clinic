import logging
from django.http import HttpRequest
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import update_last_login

from accounts.utils import normalize_phone_number

UserModel = get_user_model()

logger = logging.getLogger("auth_backend")


class AuthBackend(BaseBackend):
    """
    Custom authentication backend allowing login by both email and username.
    """

    def authenticate(
        self, request: HttpRequest, username=None, password=None, **kwargs
    ):
        phone_number = normalize_phone_number(username)

        if not phone_number or not password:
            return None
        user = None
        try:
            # try to find user by phone_number
            user = UserModel.objects.get(phone_number=phone_number)
        except UserModel.DoesNotExist:
            logger.info(
                f"User {phone_number} failed login with invalid credentials",
                extra={"phone number": phone_number},
            )
            return None
        except UserModel.MultipleObjectsReturned:
            logger.error(
                f"Multiple users with same username or email found: {phone_number}",
                extra={"phone number": phone_number},
            )
            return None

        if user.check_password(password) and user.is_active:
            # update last login and send a security alert to user
            update_last_login(None, user)  # type: ignore
            user_phone_number = user.phone_number  # type: ignore
            logger.info(
                f"User {user_phone_number} logged in successfully",
                extra={"phone number": user_phone_number},
            )
            return user
        else:
            logger.info(
                f"User {phone_number} failed login with invalid credentials",
                extra={"phone number": phone_number},
            )
            return None

    def get_user(self, user_id):
        return UserModel.objects.filter(pk=user_id).first()

from decouple import config
from django.db import models


SMS_API_KEY = str(config("SMS_API_KEY", default="", cast=str))
VERIFY_SMS_API_URL = str(config("VERIFY_SMS_API_URL", default="", cast=str))
SMS_TEMPLATE_ID = config("SMS_TEMPLATE_ID", default=0, cast=int)
RESET_PASSWORD_SMS_TEMPLATE_ID = config(
    "RESET_PASSWORD_SMS_TEMPLATE_ID", default=0, cast=int
)

MAX_AVATAR_SIZE = int(str(config("MAX_AVATAR_SIZE", 2, cast=int)))
ALLOWED_EXTENSIONS = "png,jpg,jpeg".split(",")


OTP_LENGTH = int(str(config("OTP_LENGTH", 6, cast=int)))
OTP_EXPIRY_MINUTES = int(str(config("OTP_EXPIRY_MINUTES", 5, cast=int)))
MAX_VERIFY_ATTEMPTS = int(str(config("MAX_VERIFY_ATTEMPTS", 3, cast=int)))


class OTPType(models.TextChoices):
    LOGIN = "login", "Login"
    REGISTER = "register", "Register"
    RESET_PASSWORD = "reset_password", "Reset Password"

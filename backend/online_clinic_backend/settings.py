import os
from pathlib import Path
from .utils import safe_csv
from datetime import timedelta
from decouple import Csv, config

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# ---------------------------------------------------------------
# Security & Debug Configuration
# ---------------------------------------------------------------
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY", default="secret-key", cast=str)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG", default=False, cast=bool)


# ---------------------------------------------------------------
# Installed Apps Configuration
# ---------------------------------------------------------------
INSTALLED_APPS = [
    # Default Django apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party apps
    "corsheaders",  # Cross-origin resource sharing
    "rest_framework",  # Django REST framework for building APIs
    "django_filters",  # Filtering for Django REST framework
    "rest_framework_simplejwt",  # JSON Web Token authentication
    "django_cleanup.apps.CleanupSelectedConfig",  # Clean up unused media files
    # Custom apps
    "accounts",
    "authentication",
    "finance",
    "clinic",
    "articles",
]


# ---------------------------------------------------------------
# Middleware Configuration
# ---------------------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # CORS middleware
    "django.middleware.security.SecurityMiddleware",  # Security middleware
    "django.contrib.sessions.middleware.SessionMiddleware",  # Session middleware
    "django.middleware.common.CommonMiddleware",  # Common middleware
    "django.middleware.csrf.CsrfViewMiddleware",  # CSRF protection
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # Authentication middleware
    "online_clinic_backend.middleware.RequestIDMiddleware",  # Unique trace ID per request
    "online_clinic_backend.middleware.AuditLoggingMiddleware",  # Full audit logging
    "django.contrib.messages.middleware.MessageMiddleware",  # Message middleware
    "django.middleware.clickjacking.XFrameOptionsMiddleware",  # Prevent clickjacking
]


# ---------------------------------------------------------------
# Debug Toolbar Configuration
# ---------------------------------------------------------------
ENABLE_DEBUG_TOOLBAR = config("ENABLE_DEBUG_TOOLBAR", default=False, cast=bool)
if ENABLE_DEBUG_TOOLBAR:
    INSTALLED_APPS.append("debug_toolbar")
    MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")


# ---------------------------------------------------------------
# URL Configuration
# ---------------------------------------------------------------
ROOT_URLCONF = "online_clinic_backend.urls"
WSGI_APPLICATION = "online_clinic_backend.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ---------------------------------------------------------------
# Database Configuration
# ---------------------------------------------------------------
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "online_clinic_backend_db.sqlite3",
    }
}


# ---------------------------------------------------------------
# Password Validation
# ---------------------------------------------------------------
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ---------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = "en-us"
TIME_ZONE = config("TIME_ZONE", default="UTC")
USE_I18N = config("USE_I18N", default=True, cast=bool)
USE_TZ = config("USE_TZ", default=True, cast=bool)


# ---------------------------------------------------------------
# Static & Media Files
# ---------------------------------------------------------------
# https://docs.djangoproject.com/en/5.2/howto/static-files/
# Static files URL and root directory
STATIC_URL = config("STATIC_URL", default="static/", cast=str)
STATIC_ROOT = os.path.join(
    BASE_DIR, str(config("STATIC_ROOT", default="static", cast=str))
)

# Media files URL and root directory
MEDIA_URL = config("MEDIA_URL", default="/media/", cast=str)
MEDIA_ROOT = BASE_DIR / str(config("MEDIA_ROOT", default="media", cast=str))


# ---------------------------------------------------------------
# Default Primary Key Field Type
# ---------------------------------------------------------------
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ---------------------------------------------------------------
# Allowed Hosts & Internal IPs
# ---------------------------------------------------------------
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost", cast=Csv())
INTERNAL_IPS = config("INTERNAL_IPS", default="127.0.0.1", cast=Csv())


# ---------------------------------------------------------------
# CORS & CSRF Configuration
# ---------------------------------------------------------------

# Frontend URL for redirects
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:3000", cast=str)

CORS_ALLOWED_ORIGINS = [
    origin
    for origin in safe_csv("CORS_ALLOWED_ORIGINS")
    if isinstance(origin, str) and origin.startswith(("http://", "https://"))
]

CSRF_TRUSTED_ORIGINS = [
    origin
    for origin in safe_csv("CSRF_TRUSTED_ORIGINS")
    if isinstance(origin, str) and origin.startswith(("http://", "https://"))
]

CORS_ALLOW_CREDENTIALS = config("CORS_ALLOW_CREDENTIALS", default=False, cast=bool)

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]


# ---------------------------------------------------------------
# Django REST Framework Configuration
# ---------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 100,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "otp": config("OTP_THROTTLE_RATE", default="3/minute"),
        "anon": config("ANON_THROTTLE_RATE", default="10/minute"),
        "user": config("USER_THROTTLE_RATE", default="20/minute"),
        "payment_callback": config(
            "PAYMENT_CALLBACK_THROTTLE_RATE", default="100/hour"
        ),
    },
}

# ---------------------------------------------------------------
# User and Authentication Configuration
# ---------------------------------------------------------------
AUTH_USER_MODEL = "accounts.UserModel"

AUTHENTICATION_BACKENDS = [
    "authentication.backends.AuthBackend",  # Custom authentication backend
    # "django.contrib.auth.backends.ModelBackend",  # Default Django authentication
]

# ---------------------------------------------------------------
# Email Configuration
# ---------------------------------------------------------------
# EMAIL_BACKEND = os.getenv(
#     "EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
# )
# EMAIL_HOST = os.getenv("EMAIL_HOST")
# EMAIL_PORT = os.getenv("EMAIL_PORT", 587)
# EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True") == "True"
# EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
# EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
# DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")

# ---------------------------------------------------------------
# Simple JWT Configuration
# ---------------------------------------------------------------
minutes = config("ACCESS_TOKEN_LIFETIME", 15, cast=int)
hours = config("REFRESH_TOKEN_LIFETIME", 24, cast=int)

SIMPLE_JWT = {
    # Access token lifetime
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=minutes),
    # Refresh token lifetime
    "REFRESH_TOKEN_LIFETIME": timedelta(hours=hours),
    # Authentication header type
    "AUTH_HEADER_TYPES": ("Bearer",),
    # Update last login time when refreshing token
    "UPDATE_LAST_LOGIN": True,
}

# ---------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------
LOG_LEVEL = "DEBUG" if DEBUG else "INFO"


# Ensure log directories exist
def ensure_log_dir(log_dir):
    os.makedirs(log_dir, exist_ok=True)


# Define log directories for each app
LOG_DIR = os.path.join(BASE_DIR, "logs")
APP_LOG_DIRS = {
    "user_api": os.path.join(LOG_DIR, "accounts"),  # For user api logs
    "otp_api": os.path.join(LOG_DIR, "authentication"),  # For otp api logs
    "login_api": os.path.join(LOG_DIR, "authentication"),  # For login api logs
    "auth_backend": os.path.join(LOG_DIR, "authentication"),  # For auth backend logs
    "finance_api": os.path.join(LOG_DIR, "finance"),  # For finance api logs
    "clinic_api": os.path.join(LOG_DIR, "clinic"),  # For clinic api logs
    "availability_service": os.path.join(
        LOG_DIR, "clinic"
    ),  # For availability service logs
    "booking_service": os.path.join(LOG_DIR, "clinic"),  # For booking service logs
}

# Audit log directory (separate from app logs)
AUDIT_LOG_DIR = os.path.join(LOG_DIR, "audit")

# Create log directories
for app, log_dir in APP_LOG_DIRS.items():
    ensure_log_dir(log_dir)
ensure_log_dir(AUDIT_LOG_DIR)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "format": '{"time": "%(asctime)s", "level": "%(levelname)s", "name": "%(name)s", "message": "%(message)s"}',
        },
        "console": {
            "format": "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
        },
        "audit_json": {
            "format": '{"time": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "data": %(message)s}',
        },
        "audit_console": {
            "format": "[%(asctime)s] [AUDIT] [%(levelname)s] %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "console",
        },
        "audit_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": os.path.join(AUDIT_LOG_DIR, "audit.log"),
            "maxBytes": 50 * 1024 * 1024,  # 50 MB per file
            "backupCount": 10,  # Keep 10 rotated files (500 MB total)
            "formatter": "audit_json",
            "encoding": "utf-8",
        },
        "audit_error_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": os.path.join(AUDIT_LOG_DIR, "audit_errors.log"),
            "maxBytes": 20 * 1024 * 1024,  # 20 MB per file
            "backupCount": 5,
            "formatter": "audit_json",
            "encoding": "utf-8",
            "level": "WARNING",
        },
        "audit_console": {
            "class": "logging.StreamHandler",
            "formatter": "audit_console",
        },
    },
    "loggers": {
        "audit": {
            "handlers": ["audit_file", "audit_error_file", "audit_console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

for app_name, dir_path in APP_LOG_DIRS.items():
    handler_name = f"{app_name}_file"
    LOGGING["handlers"][handler_name] = {
        "class": "logging.FileHandler",
        "filename": os.path.join(dir_path, f"{app_name}.log"),
        "level": "DEBUG" if DEBUG else "INFO",
        "formatter": "json",
        "encoding": "utf-8",
    }
    LOGGING["loggers"][app_name] = {
        "handlers": ["console", handler_name],
        "level": "DEBUG" if DEBUG else "INFO",
        "propagate": False,
    }


# ---------------------------------------------------------------
# Audit Logging Middleware Configuration
# ---------------------------------------------------------------
AUDIT_LOG_ENABLED = config("AUDIT_LOG_ENABLED", default=True, cast=bool)
AUDIT_LOG_MAX_BODY_SIZE = config("AUDIT_LOG_MAX_BODY_SIZE", default=4096, cast=int)
AUDIT_LOG_INCLUDE_REQUEST_BODY = config(
    "AUDIT_LOG_INCLUDE_REQUEST_BODY", default=True, cast=bool
)
AUDIT_LOG_INCLUDE_RESPONSE_BODY = config(
    "AUDIT_LOG_INCLUDE_RESPONSE_BODY", default=True, cast=bool
)
AUDIT_LOG_TRACK_DB_QUERIES = config(
    "AUDIT_LOG_TRACK_DB_QUERIES", default=True, cast=bool
)


# ---------------------------------------------------------------
# Celery Configuration
# ---------------------------------------------------------------
CELERY_TIMEZONE = config("CELERY_TIMEZONE", default="Asia/Tehran")
CELERY_BROKER_URL = config("CELERY_BROKER_URL", default="redis://localhost:6379/0")
CELERY_RESULT_BACKEND = config(
    "CELERY_RESULT_BACKEND", default="redis://localhost:6379/0"
)
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"

# Celery Beat (Periodic Tasks) Configuration
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    # Expire pending appointments every 5 minutes
    "expire-pending-appointments": {
        "task": "clinic.expire_pending_appointments",
        "schedule": crontab(minute="*/5"),  # Every 5 minutes
        "options": {
            "expires": 60 * 4,  # Task expires after 4 minutes (before next run)
        },
    },
}

# ---------------------------------------------------------------
# Zarinpal Payment Gateway Configuration
# ---------------------------------------------------------------
ZARINPAL_MERCHANT_ID = config(
    "ZARINPAL_MERCHANT_ID",
    default="4ced0a14-462f-11e5-b5f6-000c295eb8cd",
    cast=str,
)
ZARINPAL_SANDBOX = config("ZARINPAL_SANDBOX", default=True, cast=bool)
ZARINPAL_ACCESS_TOKEN = config("ZARINPAL_ACCESS_TOKEN", default="", cast=str)

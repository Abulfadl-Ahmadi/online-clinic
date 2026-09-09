"""
Audit Logging Middleware — Production-Grade Request/Response Logger
====================================================================

A comprehensive, security-aware middleware that captures the full lifecycle
of every HTTP request passing through the Django application.

Features
--------
- **Trace ID integration**: Links to X-Request-ID from RequestIDMiddleware
- **User identification**: UUID, phone (masked), role, auth status
- **Client fingerprinting**: Real IP (behind proxy/CDN), User-Agent parsing
  (browser, OS, device type), Referer, Origin
- **Request capture**: Method, path, query params, content type, body
- **Response capture**: Status code, content type, body (for JSON responses)
- **Performance metrics**: Request duration in milliseconds
- **DB query tracking**: Count and total time of SQL queries per request
- **Security sanitization**: Automatic masking of passwords, tokens, OTPs,
  card numbers, national codes, and other sensitive fields
- **Smart filtering**: Skips health checks, static/media files, favicon
- **Body size limits**: Prevents memory issues with large payloads
- **Structured JSON output**: Grafana Loki / ELK / CloudWatch ready

Configuration (settings.py)
----------------------------
All settings are optional with sensible defaults:

    AUDIT_LOG_ENABLED = True                    # Master switch
    AUDIT_LOG_MAX_BODY_SIZE = 4096              # Max bytes to capture per body
    AUDIT_LOG_SKIP_PATHS = ["/health", ...]     # Paths to skip (prefix match)
    AUDIT_LOG_SKIP_METHODS = []                 # HTTP methods to skip
    AUDIT_LOG_INCLUDE_REQUEST_BODY = True        # Capture request body
    AUDIT_LOG_INCLUDE_RESPONSE_BODY = True       # Capture response body
    AUDIT_LOG_SENSITIVE_FIELDS = {"password", ...}  # Extra fields to mask
    AUDIT_LOG_TRACK_DB_QUERIES = True            # Track SQL query count/time
    AUDIT_LOG_RESPONSE_BODY_STATUS_CODES = None  # If set, only log body for these
"""

import io
import json
import time
import uuid
import logging
import traceback
from typing import Any

from django.conf import settings
from django.db import connection

logger = logging.getLogger("audit")

# ─── Default Configuration ───────────────────────────────────────────

# Fields whose values should ALWAYS be masked in logs.
# These cover Django auth, JWT, OTP, payment, and PII fields.
DEFAULT_SENSITIVE_FIELDS = frozenset(
    {
        # Authentication & tokens
        "password",
        "password1",
        "password2",
        "old_password",
        "new_password",
        "new_password1",
        "new_password2",
        "confirm_password",
        "token",
        "access",
        "access_token",
        "refresh",
        "refresh_token",
        "authorization",
        "auth_token",
        "api_key",
        "apikey",
        "secret",
        "secret_key",
        "session_id",
        "sessionid",
        "csrftoken",
        "csrf_token",
        # OTP
        "otp",
        "otp_code",
        "code",
        "verification_code",
        "code_hash",
        "salt",
        # Payment & financial
        "card_number",
        "card_pan",
        "cvv",
        "cvv2",
        "pin",
        "account_number",
        "iban",
        "shaba",
        "merchant_id",
        # PII (Personally Identifiable Information)
        "national_code",
        "national_id",
        "ssn",
        "social_security",
    }
)

# Paths to skip entirely (prefix match). These generate high-volume,
# low-value log entries.
DEFAULT_SKIP_PATHS = (
    "/health",
    "/healthz",
    "/ready",
    "/readyz",
    "/ping",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/__debug__/",
)

# Content types for which we attempt to capture the body.
LOGGABLE_CONTENT_TYPES = (
    "application/json",
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain",
    "text/xml",
    "application/xml",
)


# ─── Helper Functions ────────────────────────────────────────────────


def _get_config(name: str, default: Any) -> Any:
    """Read a setting with a fallback default."""
    return getattr(settings, name, default)


def _mask_value(value: str) -> str:
    """
    Mask a sensitive string value, keeping a small hint for debugging.

    Examples:
        "my_secret_password" → "my_***"
        "ab"                 → "***"
        ""                   → "***"
    """
    if not isinstance(value, str):
        return "***"
    if len(value) <= 3:
        return "***"
    # Show first 3 chars max for debugging, mask the rest
    return value[:3] + "***"


def _sanitize_data(data: Any, sensitive_fields: frozenset, depth: int = 0) -> Any:
    """
    Recursively walk through a data structure and mask sensitive fields.

    Handles dicts, lists, and nested combinations. Caps recursion depth
    at 10 to prevent infinite loops on circular references.
    """
    if depth > 10:
        return "<max_depth_exceeded>"

    if isinstance(data, dict):
        sanitized = {}
        for key, value in data.items():
            key_lower = str(key).lower().strip()
            if key_lower in sensitive_fields:
                sanitized[key] = _mask_value(str(value)) if value else "***"
            else:
                sanitized[key] = _sanitize_data(value, sensitive_fields, depth + 1)
        return sanitized

    if isinstance(data, (list, tuple)):
        return [_sanitize_data(item, sensitive_fields, depth + 1) for item in data]

    return data


def _get_client_ip(request) -> str:
    """
    Extract the real client IP address, handling reverse proxies,
    load balancers, and CDNs (Cloudflare, AWS ALB, Nginx).

    Priority order:
        1. CF-Connecting-IP   (Cloudflare)
        2. X-Real-IP          (Nginx)
        3. X-Forwarded-For    (Standard proxy header, first IP)
        4. REMOTE_ADDR        (Direct connection)
    """
    # Cloudflare
    cf_ip = request.META.get("HTTP_CF_CONNECTING_IP")
    if cf_ip:
        return cf_ip.strip()

    # Nginx proxy
    real_ip = request.META.get("HTTP_X_REAL_IP")
    if real_ip:
        return real_ip.strip()

    # Standard proxy chain — first IP is the real client
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    # Direct connection
    return request.META.get("REMOTE_ADDR", "unknown")


def _parse_user_agent(ua_string: str) -> dict:
    """
    Parse User-Agent string into structured components.

    Uses the `user-agents` library if available, otherwise falls back
    to a basic parser that extracts key information.
    """
    if not ua_string:
        return {
            "raw": "",
            "browser": "unknown",
            "browser_version": "",
            "os": "unknown",
            "os_version": "",
            "device": "unknown",
            "is_mobile": False,
            "is_tablet": False,
            "is_bot": False,
        }

    result = {
        "raw": ua_string[:500],  # Cap length
        "browser": "unknown",
        "browser_version": "",
        "os": "unknown",
        "os_version": "",
        "device": "other",
        "is_mobile": False,
        "is_tablet": False,
        "is_bot": False,
    }

    try:
        from user_agents import parse as ua_parse

        ua = ua_parse(ua_string)
        result["browser"] = ua.browser.family or "unknown"
        result["browser_version"] = ua.browser.version_string or ""
        result["os"] = ua.os.family or "unknown"
        result["os_version"] = ua.os.version_string or ""
        result["device"] = ua.device.family or "other"
        result["is_mobile"] = ua.is_mobile
        result["is_tablet"] = ua.is_tablet
        result["is_bot"] = ua.is_bot
    except ImportError:
        # Fallback: basic detection without the user-agents library
        ua_lower = ua_string.lower()

        # Bot detection
        bot_indicators = ("bot", "crawler", "spider", "scrapy", "curl", "wget", "httpie")
        result["is_bot"] = any(ind in ua_lower for ind in bot_indicators)

        # Mobile detection
        mobile_indicators = ("mobile", "android", "iphone", "ipod")
        result["is_mobile"] = any(ind in ua_lower for ind in mobile_indicators)

        # Tablet detection
        tablet_indicators = ("tablet", "ipad")
        result["is_tablet"] = any(ind in ua_lower for ind in tablet_indicators)

        # Browser detection
        if "chrome" in ua_lower and "edg" not in ua_lower:
            result["browser"] = "Chrome"
        elif "firefox" in ua_lower:
            result["browser"] = "Firefox"
        elif "safari" in ua_lower and "chrome" not in ua_lower:
            result["browser"] = "Safari"
        elif "edg" in ua_lower:
            result["browser"] = "Edge"
        elif "opera" in ua_lower or "opr" in ua_lower:
            result["browser"] = "Opera"

        # OS detection
        if "windows" in ua_lower:
            result["os"] = "Windows"
        elif "mac os" in ua_lower or "macos" in ua_lower:
            result["os"] = "macOS"
        elif "linux" in ua_lower:
            result["os"] = "Linux"
        elif "android" in ua_lower:
            result["os"] = "Android"
        elif "iphone" in ua_lower or "ipad" in ua_lower:
            result["os"] = "iOS"

        # Device type
        if result["is_mobile"]:
            result["device"] = "Mobile"
        elif result["is_tablet"]:
            result["device"] = "Tablet"
        elif result["is_bot"]:
            result["device"] = "Bot"
        else:
            result["device"] = "Desktop"

    return result


def _safe_json_parse(body: bytes, max_size: int) -> Any:
    """
    Safely parse a request/response body as JSON.

    Returns the parsed data (dict/list) or a string representation
    if parsing fails. Respects the max_size limit.
    """
    if not body:
        return None

    if len(body) > max_size:
        return f"<body_too_large: {len(body)} bytes, limit: {max_size}>"

    try:
        return json.loads(body)
    except (json.JSONDecodeError, UnicodeDecodeError, ValueError):
        try:
            text = body.decode("utf-8", errors="replace")
            return text[:max_size]
        except Exception:
            return f"<binary_body: {len(body)} bytes>"


def _get_user_info(request) -> dict:
    """
    Extract authenticated user information from the request.

    Masks the phone number for privacy in logs while keeping
    enough digits for identification.
    """
    user_info = {
        "is_authenticated": False,
        "id": None,
        "phone": None,
        "role": None,
        "status": None,
    }

    try:
        user = getattr(request, "user", None)
        if user and hasattr(user, "is_authenticated") and user.is_authenticated:
            user_info["is_authenticated"] = True
            user_info["id"] = str(user.pk) if user.pk else None

            # Mask phone number: 0912***4567
            phone = getattr(user, "phone_number", None)
            if phone and len(phone) >= 7:
                user_info["phone"] = phone[:4] + "***" + phone[-4:]
            elif phone:
                user_info["phone"] = "***"

            user_info["role"] = getattr(user, "role", None)
            user_info["status"] = getattr(user, "status", None)
    except Exception:
        # User model might not be loaded yet, or the user object is
        # in an inconsistent state (e.g., during auth failures)
        pass

    return user_info


def _get_db_query_stats(initial_count: int) -> dict:
    """
    Calculate the number of DB queries executed during this request
    and their total execution time.
    """
    queries = connection.queries[initial_count:]
    total_time = sum(float(q.get("time", 0)) for q in queries)
    return {
        "query_count": len(queries),
        "total_time_ms": round(total_time * 1000, 2),
    }


def _mask_phone_in_path(path: str) -> str:
    """
    Mask phone numbers that might appear in URL paths.
    Pattern: Iranian phone numbers (09xxxxxxxxx or +989xxxxxxxxx)
    """
    import re

    # Mask 09xxxxxxxxx patterns
    path = re.sub(
        r"(09\d{2})\d{3}(\d{4})",
        r"\1***\2",
        path,
    )
    # Mask +989xxxxxxxxx patterns
    path = re.sub(
        r"(\+989\d{1})\d{3}(\d{4})",
        r"\1***\2",
        path,
    )
    return path


# ─── Main Middleware ─────────────────────────────────────────────────


class AuditLoggingMiddleware:
    """
    Production-grade audit logging middleware for Django REST Framework.

    Captures comprehensive request/response data as structured JSON logs,
    suitable for analysis in Grafana Loki, ELK Stack, or any log aggregator.

    Place AFTER AuthenticationMiddleware in settings.py to ensure
    request.user is populated.

    Usage in settings.py:
        MIDDLEWARE = [
            ...
            'django.contrib.auth.middleware.AuthenticationMiddleware',
            'online_clinic_backend.middleware.RequestIDMiddleware',
            'online_clinic_backend.middleware.AuditLoggingMiddleware',
            ...
        ]
    """

    def __init__(self, get_response):
        self.get_response = get_response

        # Load configuration once at startup
        self.enabled = _get_config("AUDIT_LOG_ENABLED", True)
        self.max_body_size = _get_config("AUDIT_LOG_MAX_BODY_SIZE", 4096)
        self.include_request_body = _get_config("AUDIT_LOG_INCLUDE_REQUEST_BODY", True)
        self.include_response_body = _get_config("AUDIT_LOG_INCLUDE_RESPONSE_BODY", True)
        self.track_db_queries = _get_config("AUDIT_LOG_TRACK_DB_QUERIES", True)
        self.skip_methods = set(_get_config("AUDIT_LOG_SKIP_METHODS", set()))
        self.response_body_status_codes = _get_config(
            "AUDIT_LOG_RESPONSE_BODY_STATUS_CODES", None
        )

        # Merge default + user-provided sensitive fields
        extra_fields = _get_config("AUDIT_LOG_SENSITIVE_FIELDS", set())
        self.sensitive_fields = DEFAULT_SENSITIVE_FIELDS | frozenset(
            f.lower() for f in extra_fields
        )

        # Skip paths: combine defaults with user-provided
        extra_skip = _get_config("AUDIT_LOG_SKIP_PATHS", [])
        self.skip_paths = tuple(DEFAULT_SKIP_PATHS) + tuple(extra_skip)

        # Static and media URL prefixes to skip
        self.static_url = getattr(settings, "STATIC_URL", "/static/")
        self.media_url = getattr(settings, "MEDIA_URL", "/media/")

    def _should_skip(self, request) -> bool:
        """Determine if this request should be skipped from logging."""
        path = request.path

        # Skip static and media files
        if path.startswith(self.static_url) or path.startswith(self.media_url):
            return True

        # Skip configured paths (prefix match)
        if any(path.startswith(skip) for skip in self.skip_paths):
            return True

        # Skip configured HTTP methods
        if request.method in self.skip_methods:
            return True

        return False

    def _capture_request_body(self, request) -> Any:
        """
        Safely capture and parse the request body.

        Handles JSON, form data, and multipart uploads.
        For file uploads, only metadata is logged (not the file contents).
        """
        if not self.include_request_body:
            return None

        content_type = request.content_type or ""

        # Don't try to read file upload bodies — too large and binary
        if "multipart/form-data" in content_type:
            files_info = {}
            for field_name, uploaded_file in request.FILES.items():
                files_info[field_name] = {
                    "filename": uploaded_file.name,
                    "size_bytes": uploaded_file.size,
                    "content_type": uploaded_file.content_type,
                }
            return {
                "_type": "multipart",
                "fields": dict(request.POST) if request.POST else {},
                "files": files_info,
            }

        # Only attempt to parse known content types
        if not any(ct in content_type for ct in LOGGABLE_CONTENT_TYPES):
            if request.body:
                return f"<binary_content_type: {content_type}, {len(request.body)} bytes>"
            return None

        try:
            body = request.body
            if not body:
                return None

            parsed = _safe_json_parse(body, self.max_body_size)
            return _sanitize_data(parsed, self.sensitive_fields)
        except Exception:
            return "<body_read_error>"

    def _capture_response_body(self, response) -> Any:
        """
        Safely capture the response body for JSON responses.

        Only captures JSON responses to avoid logging binary content
        (images, PDFs, file downloads, etc.).
        """
        if not self.include_response_body:
            return None

        # If specific status codes are configured, only log those
        if (
            self.response_body_status_codes
            and response.status_code not in self.response_body_status_codes
        ):
            return None

        content_type = response.get("Content-Type", "")

        # Only log JSON responses
        if "application/json" not in content_type:
            return None

        try:
            content = response.content
            if not content:
                return None

            parsed = _safe_json_parse(content, self.max_body_size)
            return _sanitize_data(parsed, self.sensitive_fields)
        except Exception:
            return "<response_read_error>"

    def __call__(self, request):
        # Master switch
        if not self.enabled or self._should_skip(request):
            return self.get_response(request)

        # ── Pre-request phase ─────────────────────────────────
        start_time = time.monotonic()
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%S%z")

        # Track DB queries if enabled
        initial_query_count = len(connection.queries) if self.track_db_queries else 0

        # Capture request body BEFORE the response is generated
        # (Django's request.body can only be read once in some cases)
        request_body = None
        try:
            request_body = self._capture_request_body(request)
        except Exception:
            request_body = "<body_capture_error>"

        # ── Process request ───────────────────────────────────
        exception_info = None
        try:
            response = self.get_response(request)
        except Exception as exc:
            # Capture unhandled exceptions before they propagate
            exception_info = {
                "type": type(exc).__name__,
                "message": str(exc)[:500],
                "traceback": traceback.format_exc()[-2000:],
            }
            raise
        finally:
            # ── Post-request phase ────────────────────────────
            duration_ms = round((time.monotonic() - start_time) * 1000, 2)

            try:
                # Build the comprehensive log entry
                log_entry = self._build_log_entry(
                    request=request,
                    response=response if exception_info is None else None,
                    request_body=request_body,
                    duration_ms=duration_ms,
                    timestamp=timestamp,
                    initial_query_count=initial_query_count,
                    exception_info=exception_info,
                )

                # Determine log level based on status code
                if exception_info:
                    log_level = logging.ERROR
                elif hasattr(response, "status_code"):
                    status = response.status_code
                    if status >= 500:
                        log_level = logging.ERROR
                    elif status >= 400:
                        log_level = logging.WARNING
                    else:
                        log_level = logging.INFO
                else:
                    log_level = logging.INFO

                # Emit as structured JSON
                logger.log(log_level, json.dumps(log_entry, ensure_ascii=False, default=str))

            except Exception as log_err:
                # NEVER let logging errors crash the application
                logger.error(
                    json.dumps(
                        {
                            "event": "audit_log_error",
                            "error": str(log_err)[:500],
                            "path": getattr(request, "path", "unknown"),
                        },
                        ensure_ascii=False,
                    )
                )

        return response

    def _build_log_entry(
        self,
        request,
        response,
        request_body,
        duration_ms: float,
        timestamp: str,
        initial_query_count: int,
        exception_info: dict | None,
    ) -> dict:
        """
        Assemble the complete structured log entry.

        The output is a flat-ish JSON structure optimized for log querying
        in Grafana Loki (labels + JSON fields).
        """
        # Request ID from RequestIDMiddleware
        request_id = getattr(request, "id", None) or str(uuid.uuid4())

        # User information
        user_info = _get_user_info(request)

        # Client information
        client_ip = _get_client_ip(request)
        ua_info = _parse_user_agent(request.META.get("HTTP_USER_AGENT", ""))

        # Query parameters (sanitized)
        query_params = dict(request.GET) if request.GET else None
        if query_params:
            query_params = _sanitize_data(query_params, self.sensitive_fields)

        # Response body
        response_body = None
        response_status = None
        response_content_type = None
        response_size = None

        if response is not None:
            response_status = response.status_code
            response_content_type = response.get("Content-Type", "")
            response_size = len(response.content) if hasattr(response, "content") else None
            response_body = self._capture_response_body(response)

        # DB query stats
        db_stats = None
        if self.track_db_queries and settings.DEBUG:
            db_stats = _get_db_query_stats(initial_query_count)

        # Build the final log structure
        log_entry = {
            # ── Identification ──
            "event": "http_request",
            "trace_id": request_id,
            "timestamp": timestamp,
            # ── Request ──
            "request": {
                "method": request.method,
                "path": _mask_phone_in_path(request.path),
                "full_path": _mask_phone_in_path(request.get_full_path()),
                "query_params": query_params,
                "content_type": request.content_type,
                "body": request_body,
            },
            # ── Response ──
            "response": {
                "status_code": response_status,
                "content_type": response_content_type,
                "size_bytes": response_size,
                "body": response_body,
            },
            # ── Performance ──
            "performance": {
                "duration_ms": duration_ms,
                "db": db_stats,
            },
            # ── User ──
            "user": user_info,
            # ── Client ──
            "client": {
                "ip": client_ip,
                "user_agent": ua_info,
                "referer": request.META.get("HTTP_REFERER", None),
                "origin": request.META.get("HTTP_ORIGIN", None),
            },
            # ── Network ──
            "network": {
                "scheme": request.scheme,
                "host": request.get_host(),
                "server_port": request.META.get("SERVER_PORT"),
                "is_secure": request.is_secure(),
                "is_ajax": request.headers.get("X-Requested-With") == "XMLHttpRequest",
                "x_forwarded_for": request.META.get("HTTP_X_FORWARDED_FOR"),
                "x_forwarded_proto": request.META.get("HTTP_X_FORWARDED_PROTO"),
            },
        }

        # Add exception info if present
        if exception_info:
            log_entry["exception"] = exception_info

        # ── Cleanup: remove None values at top level to reduce log size ──
        log_entry["request"] = {k: v for k, v in log_entry["request"].items() if v is not None}
        log_entry["response"] = {
            k: v for k, v in log_entry["response"].items() if v is not None
        }
        log_entry["network"] = {k: v for k, v in log_entry["network"].items() if v is not None}

        return log_entry

    def process_exception(self, request, exception):
        """
        Called by Django when a view raises an unhandled exception.

        We log a dedicated error entry with full traceback.
        Note: The main __call__ also handles this via try/except,
        but this hook catches exceptions from middleware below us.
        """
        request_id = getattr(request, "id", None) or "no-trace-id"

        logger.error(
            json.dumps(
                {
                    "event": "unhandled_exception",
                    "trace_id": request_id,
                    "exception_type": type(exception).__name__,
                    "exception_message": str(exception)[:1000],
                    "path": _mask_phone_in_path(request.path),
                    "method": request.method,
                    "user_id": str(request.user.pk)
                    if hasattr(request, "user")
                    and hasattr(request.user, "pk")
                    and request.user.pk
                    else None,
                    "client_ip": _get_client_ip(request),
                    "traceback": traceback.format_exc()[-3000:],
                },
                ensure_ascii=False,
                default=str,
            )
        )

        # Return None to let Django's normal exception handling continue
        return None

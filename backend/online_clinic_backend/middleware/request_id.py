"""
Request ID Middleware
=====================
Generates a unique X-Request-ID (UUID4) for every incoming request and
attaches it to both the request object and the response headers.

This enables distributed tracing across services: the same ID can be
passed to downstream services, logged by the audit middleware, and
searched in Grafana Loki.

If the client already sends an X-Request-ID header (e.g. from a load
balancer or API gateway), that value is preserved instead of generating
a new one.
"""

import uuid
import logging
import threading

from django.conf import settings

logger = logging.getLogger("audit")

# Thread-local storage so any code in the request cycle can access the
# current request ID without needing the request object.
_thread_locals = threading.local()

REQUEST_ID_HEADER = "HTTP_X_REQUEST_ID"
RESPONSE_HEADER = "X-Request-ID"


def get_current_request_id() -> str | None:
    """
    Retrieve the request ID for the current thread.

    This can be called from anywhere in the Django request cycle
    (views, serializers, services, model methods, signals, etc.)
    to get the current request's trace ID.
    """
    return getattr(_thread_locals, "request_id", None)


class RequestIDMiddleware:
    """
    Injects a unique request ID into every request/response cycle.

    Usage in settings.py:
        MIDDLEWARE = [
            ...
            'online_clinic_backend.middleware.RequestIDMiddleware',
            ...
        ]

    The ID is accessible via:
        - request.id              — on the request object
        - response['X-Request-ID'] — on the response headers
        - get_current_request_id() — from anywhere in the same thread
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Reuse client-provided ID or generate a new one
        request_id = request.META.get(REQUEST_ID_HEADER) or str(uuid.uuid4())

        # Attach to request object for easy access in views
        request.id = request_id

        # Store in thread-local for access anywhere in the call stack
        _thread_locals.request_id = request_id

        response = self.get_response(request)

        # Always include in response so the client can correlate
        response[RESPONSE_HEADER] = request_id

        # Clean up thread-local
        _thread_locals.request_id = None

        return response

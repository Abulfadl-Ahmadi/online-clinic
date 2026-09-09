from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RecurringAvailabilityViewSet,
    AvailabilityExceptionViewSet,
    DoctorAvailabilityViewSet,
    AppointmentViewSet,
)

router = DefaultRouter()
router.register(
    r"recurring-availability",
    RecurringAvailabilityViewSet,
    basename="recurring-availability",
)
router.register(
    r"availability-exceptions",
    AvailabilityExceptionViewSet,
    basename="availability-exception",
)
router.register(
    r"doctor-availability", DoctorAvailabilityViewSet, basename="doctor-availability"
)
router.register(r"appointments", AppointmentViewSet, basename="appointment")

urlpatterns = [
    path("", include(router.urls)),
]

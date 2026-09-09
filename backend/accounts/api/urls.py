from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserAPIView,
    ProfileAPIView,
    SettingsAPIView,
    DoctorViewSet,
    SpecializationViewSet,
)


router = DefaultRouter()
router.register(r"doctors", DoctorViewSet, basename="doctor")
router.register(r"specializations", SpecializationViewSet, basename="specialization")


base = "me"

urlpatterns = [
    path(f"{base}/", UserAPIView.as_view(), name=f"{base}"),
    path(f"{base}/profile/", ProfileAPIView.as_view(), name=f"{base}-profile"),
    path(f"{base}/settings/", SettingsAPIView.as_view(), name=f"{base}-settings"),
    # doctors and specializations - include router with trailing slash
    path("", include(router.urls)),
]

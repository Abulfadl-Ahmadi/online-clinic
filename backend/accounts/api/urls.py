from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserAPIView,
    ProfileAPIView,
    SettingsAPIView,
    DoctorViewSet,
    SpecializationViewSet,
    ChangePasswordAPIView,
)


router = DefaultRouter()
router.register(r"doctors", DoctorViewSet, basename="doctor")
router.register(r"specializations", SpecializationViewSet, basename="specialization")


base = "me"

urlpatterns = [
    path(f"{base}/", UserAPIView.as_view(), name=f"{base}"),
    path(f"{base}/profile/", ProfileAPIView.as_view(), name=f"{base}-profile"),
    path(f"{base}/settings/", SettingsAPIView.as_view(), name=f"{base}-settings"),
    path(f"{base}/change-password/", ChangePasswordAPIView.as_view(), name=f"{base}-change-password"),
    # doctors and specializations - include router with trailing slash
    path("", include(router.urls)),
]

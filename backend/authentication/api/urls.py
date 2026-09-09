from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginAPIView, SendOTPView, VerifyOTPView, RegisterUpdateView

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("register/", RegisterUpdateView.as_view(), name="register-update"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
]

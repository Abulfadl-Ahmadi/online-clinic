from django.urls import path
from .views import (
    TransactionListView,
    TransactionDetailView,
    PaymentInitiateView,
    PaymentVerifyView,
    PaymentCallbackView,
)

app_name = "finance"

urlpatterns = [
    # Transaction management
    path("transactions/", TransactionListView.as_view(), name="transaction-list"),
    path(
        "transactions/<uuid:pk>/",
        TransactionDetailView.as_view(),
        name="transaction-detail",
    ),
    # Payment operations
    path("payments/initiate/", PaymentInitiateView.as_view(), name="payment-initiate"),
    path("payments/verify/", PaymentVerifyView.as_view(), name="payment-verify"),
    path("payments/callback/", PaymentCallbackView.as_view(), name="payment-callback"),
]

import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from finance.models import TransactionModel, TransactionStatus, TransactionCurrency


class TransactionModelTest(TestCase):
    """
    Test cases for TransactionModel.
    """

    def setUp(self):
        """Set up test data."""
        self.user = get_user_model().objects.create_user(
            phone_number="09123456789",
            password="testpass123"
        )

    def test_transaction_creation(self):
        """Test creating a transaction."""
        transaction = TransactionModel.objects.create(
            user=self.user,
            amount=50000,
            currency=TransactionCurrency.IRR,
            description="Test payment",
            authority="TEST-123",
            callback_url="https://example.com/callback"
        )

        self.assertEqual(transaction.user, self.user)
        self.assertEqual(transaction.amount, 50000)
        self.assertEqual(transaction.currency, TransactionCurrency.IRR)
        self.assertEqual(transaction.status, TransactionStatus.PENDING)
        self.assertFalse(transaction.is_successful)

    def test_transaction_str_method(self):
        """Test string representation of transaction."""
        transaction = TransactionModel.objects.create(
            user=self.user,
            amount=100000,
            currency=TransactionCurrency.IRT,
            description="Test payment",
            authority="TEST-456",
            callback_url="https://example.com/callback"
        )

        expected_str = f"Transaction TEST-456 - 100000 IRT - pending"
        self.assertEqual(str(transaction), expected_str)

    def test_amount_display_property(self):
        """Test amount display property."""
        transaction = TransactionModel.objects.create(
            user=self.user,
            amount=75000,
            currency=TransactionCurrency.IRR,
            description="Test payment",
            authority="TEST-789",
            callback_url="https://example.com/callback"
        )

        self.assertEqual(transaction.amount_display, "75,000 ریال")

    def test_successful_transaction(self):
        """Test successful transaction status."""
        transaction = TransactionModel.objects.create(
            user=self.user,
            amount=50000,
            currency=TransactionCurrency.IRR,
            description="Test payment",
            authority="TEST-101",
            callback_url="https://example.com/callback"
        )

        # Initially not successful
        self.assertFalse(transaction.is_successful)

        # Mark as paid
        transaction.status = TransactionStatus.PAID
        transaction.save()

        # Now should be successful
        self.assertTrue(transaction.is_successful)


class TransactionAPITest(APITestCase):
    """
    Test cases for Transaction API endpoints.
    """

    def setUp(self):
        """Set up test data and authentication."""
        self.user = get_user_model().objects.create_user(
            phone_number="09123456789",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        # Don't create transaction in setUp to avoid test interference

    def test_list_transactions(self):
        """Test listing user transactions."""
        # Clear all transactions for this user to ensure clean test
        TransactionModel.objects.filter(user=self.user).delete()

        # Create a specific transaction for this test
        TransactionModel.objects.create(
            user=self.user,
            amount=200000,
            currency=TransactionCurrency.IRR,
            description="List test payment",
            authority="LIST-TEST-001",
            callback_url="https://example.com/callback"
        )

        url = reverse('finance:transaction-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle pagination - check results array
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['authority'], 'LIST-TEST-001')

    def test_retrieve_transaction(self):
        """Test retrieving specific transaction."""
        transaction = TransactionModel.objects.create(
            user=self.user,
            amount=100000,
            currency=TransactionCurrency.IRR,
            description="Retrieve test payment",
            authority="RETRIEVE-TEST-001",
            callback_url="https://example.com/callback"
        )

        url = reverse('finance:transaction-detail', kwargs={'pk': transaction.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['authority'], 'RETRIEVE-TEST-001')
        self.assertEqual(response.data['amount'], 100000)

    def test_initiate_payment(self):
        """Test payment initiation."""
        initial_count = TransactionModel.objects.filter(user=self.user).count()

        url = reverse('finance:payment-initiate')
        data = {
            'amount': 50000,
            'currency': TransactionCurrency.IRR,
            'description': 'Test payment initiation',
            'callback_url': 'https://example.com/callback'
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('authority', response.data)
        self.assertIn('payment_url', response.data)

        # Check that transaction was created
        final_count = TransactionModel.objects.filter(user=self.user).count()
        self.assertEqual(final_count, initial_count + 1)

    def test_verify_payment(self):
        """Test payment verification."""
        transaction = TransactionModel.objects.create(
            user=self.user,
            amount=100000,
            currency=TransactionCurrency.IRR,
            description="Verify test payment",
            authority="VERIFY-TEST-001",
            callback_url="https://example.com/callback"
        )

        url = reverse('finance:payment-verify')
        data = {
            'authority': 'VERIFY-TEST-001'
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('ref_id', response.data)

        # Check that transaction was updated
        transaction.refresh_from_db()
        self.assertEqual(transaction.status, TransactionStatus.PAID)
        self.assertIsNotNone(transaction.ref_id)

    def test_verify_nonexistent_transaction(self):
        """Test verifying non-existent transaction."""
        url = reverse('finance:payment-verify')
        data = {
            'authority': 'NONEXISTENT'
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access endpoints."""
        self.client.force_authenticate(user=None)

        url = reverse('finance:transaction-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

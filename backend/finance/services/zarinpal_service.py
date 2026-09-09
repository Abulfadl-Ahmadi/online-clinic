import logging
import requests
from typing import Dict, Optional, Tuple
from django.conf import settings
from django.utils import timezone

from finance.models import TransactionModel, PaymentModel, RefundModel
from finance.constants import TransactionStatus, PaymentStatus
from clinic.models import AppointmentModel

logger = logging.getLogger("zarinpal_service")


class ZarinPalService:
    """
    Service for handling ZarinPal payment gateway operations.
    Uses direct REST API calls.
    """

    def __init__(self):
        self.sandbox = getattr(settings, 'ZARINPAL_SANDBOX', False)
        merchant_id = getattr(settings, 'ZARINPAL_MERCHANT_ID', '')
        if not merchant_id or not str(merchant_id).strip():
            merchant_id = '4ced0a14-462f-11e5-b5f6-000c295eb8cd' if self.sandbox else ''
        self.merchant_id = str(merchant_id).strip()
        
        # Use sandbox or production URLs
        if self.sandbox:
            self.api_base = "https://sandbox.zarinpal.com/pg/v4/payment"
            self.payment_base = "https://sandbox.zarinpal.com/pg/StartPay"
        else:
            self.api_base = "https://payment.zarinpal.com/pg/v4/payment"
            self.payment_base = "https://payment.zarinpal.com/pg/StartPay"

    def initiate_payment(
        self,
        transaction: TransactionModel,
        callback_url: str,
        mobile: Optional[str] = None,
        email: Optional[str] = None,
    ) -> Tuple[bool, str, Optional[str]]:
        """
        Initiate payment with ZarinPal REST API.

        Args:
            transaction: TransactionModel instance
            callback_url: URL to redirect after payment
            mobile: Optional mobile number
            email: Optional email

        Returns:
            Tuple of (success, authority, payment_url)
        """
        try:
            # Prepare request data
            data = {
                "merchant_id": self.merchant_id,
                "amount": int(transaction.amount),
                "callback_url": callback_url,
                "description": transaction.description or "پرداخت نوبت کلینیک آنلاین",
            }
            
            metadata = {}
            if mobile:
                metadata["mobile"] = mobile
            if email:
                metadata["email"] = email
            if metadata:
                data["metadata"] = metadata

            # Call ZarinPal API
            url = f"{self.api_base}/request.json"
            headers = {"Content-Type": "application/json"}
            
            logger.info(f"Initiating payment request to: {url}")
            response = requests.post(url, json=data, headers=headers, timeout=10)
            response_data = response.json()

            logger.info(f"ZarinPal response: {response_data}")

            # Check response
            if response_data.get("data") and response_data["data"].get("code") == 100:
                authority = response_data["data"]["authority"]
                payment_url = f"{self.payment_base}/{authority}"

                transaction.authority = authority
                transaction.save(update_fields=['authority'])

                logger.info(f"Payment initiated successfully: {authority}")
                return True, authority, payment_url
            else:
                errors = response_data.get("errors")
                if isinstance(errors, dict):
                    error_msg = errors.get("message", str(errors))
                elif isinstance(errors, list) and errors:
                    error_msg = errors[0].get("message", str(errors[0])) if isinstance(errors[0], dict) else str(errors)
                else:
                    error_msg = str(errors or "Unknown error")
                logger.error(f"Payment initiation failed: {error_msg}")
                return False, "", None

        except requests.RequestException as e:
            logger.error(f"Payment initiation request error: {str(e)}")
            return False, "", None
        except Exception as e:
            logger.error(f"Payment initiation error: {str(e)}")
            return False, "", None

    def verify_payment(self, authority: str, amount: int) -> Tuple[bool, Optional[Dict]]:
        """
        Verify payment with ZarinPal REST API.

        Args:
            authority: Payment authority code
            amount: Expected payment amount

        Returns:
            Tuple of (success, verification_data)
        """
        try:
            # Prepare request data
            data = {
                "merchant_id": self.merchant_id,
                "amount": amount,
                "authority": authority,
            }

            # Call ZarinPal verify API
            url = f"{self.api_base}/verify.json"
            headers = {"Content-Type": "application/json"}
            
            logger.info(f"Verifying payment for authority: {authority}")
            response = requests.post(url, json=data, headers=headers, timeout=10)
            response_data = response.json()

            logger.info(f"ZarinPal verify response: {response_data}")

            # Check response
            if response_data.get("data"):
                code = response_data["data"].get("code")
                
                if code == 100:  # Success
                    verification_data = {
                        "ref_id": response_data["data"].get("ref_id"),
                        "card_pan": response_data["data"].get("card_pan"),
                        "fee": response_data["data"].get("fee", 0),
                    }
                    logger.info(f"Payment verified successfully: {authority}, ref_id: {verification_data['ref_id']}")
                    return True, verification_data
                    
                elif code == 101:  # Already verified
                    logger.info(f"Payment already verified: {authority}")
                    verification_data = {
                        "ref_id": response_data["data"].get("ref_id"),
                        "card_pan": response_data["data"].get("card_pan"),
                        "fee": response_data["data"].get("fee", 0),
                    }
                    return True, verification_data
                    
                else:
                    errors = response_data.get("errors")
                    error_msg = errors.get("message") if isinstance(errors, dict) else str(errors) if errors else f"Unknown error code: {code}"
                    logger.error(f"Payment verification failed: {error_msg}")
                    return False, None
            else:
                errors = response_data.get("errors")
                error_msg = errors.get("message") if isinstance(errors, dict) else str(errors) if errors else "Unknown error"
                logger.error(f"Payment verification failed: {error_msg}")
                return False, None

        except requests.RequestException as e:
            logger.error(f"Payment verification request error: {str(e)}")
            return False, None
        except Exception as e:
            logger.error(f"Payment verification error: {str(e)}")
            return False, None

    def process_refund(
        self,
        session_id: str,
        amount: int,
        description: str,
        method: str = "CARD",
        reason: str = "CUSTOMER_REQUEST"
    ) -> Tuple[bool, Optional[str]]:
        """
        Process refund with ZarinPal.

        Args:
            session_id: Transaction session ID
            amount: Refund amount
            description: Refund description
            method: Refund method (CARD or PAYA)
            reason: Refund reason

        Returns:
            Tuple of (success, refund_id)
        """
        try:
            if not self.sdk_available:
                # Mock refund for development
                logger.info(f"Mock refund processed for session: {session_id}")
                return True, f"REFUND-{session_id}"

            # Real ZarinPal refund
            response = self.zarinpal.refunds.create({
                "session_id": session_id,
                "amount": amount,
                "description": description,
                "method": method,
                "reason": reason,
            })

            if response.get("data") and response["data"].get("id"):
                refund_id = response["data"]["id"]
                logger.info(f"Refund processed successfully: {refund_id}")
                return True, refund_id
            else:
                logger.error(f"Refund failed: {response}")
                return False, None

        except Exception as e:
            logger.error(f"Refund error: {str(e)}")
            return False, None

    def inquire_transaction(self, authority: str) -> Optional[Dict]:
        """
        Inquire transaction status with ZarinPal.

        Args:
            authority: Payment authority code

        Returns:
            Transaction inquiry data or None
        """
        try:
            if not self.sdk_available:
                # Mock inquiry for development
                logger.info(f"Mock transaction inquiry for authority: {authority}")
                return {
                    "code": 100,
                    "status": "PAID",
                    "amount": 50000,
                }

            # Real ZarinPal inquiry
            response = self.zarinpal.inquiries.inquire({
                "authority": authority,
            })

            if response.get("data"):
                return response["data"]
            else:
                logger.error(f"Transaction inquiry failed: {response}")
                return None

        except Exception as e:
            logger.error(f"Transaction inquiry error: {str(e)}")
            return None


# Singleton instance
zarinpal_service = ZarinPalService()
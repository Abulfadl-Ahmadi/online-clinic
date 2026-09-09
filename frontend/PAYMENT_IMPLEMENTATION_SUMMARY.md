# Payment Flow Implementation Summary

## Changes Made

This document summarizes all changes made to implement the correct payment flow where **appointments are only confirmed after successful payment**.

## Date: November 9, 2025

---

## 🎯 Objective

Ensure that appointment reservations are **only confirmed after successful payment through ZarinPal**. The booking flow must follow this sequence:

1. User requests appointment → **Appointment created with PENDING status**
2. User redirected to ZarinPal payment gateway
3. After payment, ZarinPal redirects to backend callback
4. Backend verifies payment with ZarinPal
5. **Only if payment succeeds** → Appointment status changed to CONFIRMED
6. User redirected to frontend success/failure page

---

## 📝 Backend Changes

### 1. Added FRONTEND_URL Configuration
**File**: `online-clinic-backend/online_clinic_backend/settings.py`

**Change**:
```python
# Frontend URL for redirects
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:3000", cast=str)
```

**Purpose**: Store frontend URL for redirecting users after payment

**Environment Variable Required**:
```env
FRONTEND_URL=http://localhost:3000  # Development
FRONTEND_URL=https://your-domain.com  # Production
```

---

### 2. Updated Payment Callback to Use HTTP Redirects
**File**: `online-clinic-backend/finance/api/views/transaction_views.py`

#### Import Addition:
```python
from django.shortcuts import get_object_or_404, redirect  # Added redirect
```

#### PaymentCallbackView.get() Method:
**Before** (Incorrect):
```python
def get(self, request):
    # ... verification code ...
    
    if success and appointment:
        return Response({
            "status": "success",
            "appointment_id": str(appointment.id),
            "redirect_url": success_url,
        })
    else:
        return Response({
            "status": "failed",
            "redirect_url": failure_url,
        }, status=400)
```

**After** (Correct):
```python
def get(self, request):
    """
    Handle ZarinPal callback (GET request with query parameters).
    Verifies payment and redirects user to frontend success/failure page.
    """
    authority = request.query_params.get("Authority")
    status_param = request.query_params.get("Status")

    if not authority:
        # Redirect to frontend failure page
        frontend_url = settings.FRONTEND_URL
        return redirect(f"{frontend_url}/user/payment/failure?error=missing_authority")

    try:
        # Verify payment and confirm appointment
        success, appointment, verification_data = PaymentService.verify_payment_and_confirm_appointment(
            authority=authority
        )

        frontend_url = settings.FRONTEND_URL

        if success and appointment:
            # Redirect to frontend success page with appointment details
            success_url = f"{frontend_url}/user/payment/success?appointment_id={appointment.id}&authority={authority}&status=OK"
            return redirect(success_url)
        else:
            # Redirect to frontend failure page
            failure_url = f"{frontend_url}/user/payment/failure?authority={authority}&status={status_param or 'NOK'}"
            return redirect(failure_url)

    except Exception as e:
        logger.error(f"Payment callback error for authority {authority}: {str(e)}")
        frontend_url = settings.FRONTEND_URL
        return redirect(f"{frontend_url}/user/payment/failure?authority={authority}&error=processing_failed")
```

**Key Changes**:
- ✅ Uses `redirect()` instead of `Response()` with JSON
- ✅ Returns HTTP 302 redirect to frontend URLs
- ✅ Includes appointment_id and status in success URL
- ✅ Includes error details in failure URL
- ✅ Handles all error cases with appropriate redirects

**Why This Matters**:
- ZarinPal sends users to the callback URL via browser redirect
- Backend must redirect the browser to frontend, not return JSON
- JSON response would show raw data in browser instead of proper UI

---

## 📱 Frontend Changes

### 3. Updated Payment Success Page
**File**: `src/app/(private)/user/payment/success/page.tsx`

#### Before (Incorrect - Called verification API):
```tsx
export default function PaymentSuccessPage() {
    const [verifying, setVerifying] = useState(true);
    
    useEffect(() => {
        verifyPayment(authority, status);  // ❌ Unnecessary API call
    }, []);
    
    const verifyPayment = async (authority: string, status: string) => {
        const result = await verifyAppointmentPayment(authority, status);
        // Process result...
    };
}
```

#### After (Correct - No API call):
```tsx
export default function PaymentSuccessPage() {
    const [loading, setLoading] = useState(true);
    const [appointmentId, setAppointmentId] = useState<string | null>(null);

    useEffect(() => {
        const appointmentIdParam = searchParams.get("appointment_id");
        const authority = searchParams.get("authority");
        const status = searchParams.get("status");

        // Check if required parameters are present
        if (!authority || status !== "OK") {
            // If parameters missing or status not OK, redirect to failure
            router.push("/user/payment/failure");
            return;
        }

        // Payment already verified by backend callback
        setAppointmentId(appointmentIdParam);
        setLoading(false);
    }, [searchParams, router]);

    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-lg mx-auto">
                <CardHeader className="text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                    <CardTitle className="text-2xl">پرداخت موفق!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p>نوبت شما با موفقیت رزرو و تایید شد</p>
                    {appointmentId && (
                        <p className="text-sm">شماره رزرو: {appointmentId}</p>
                    )}
                    {/* Links to appointments and new booking */}
                </CardContent>
            </Card>
        </div>
    );
}
```

**Key Changes**:
- ❌ Removed `verifyAppointmentPayment()` call
- ❌ Removed unnecessary API import
- ✅ Simply reads parameters from URL
- ✅ Shows success message immediately
- ✅ Displays appointment ID if available

**Why This Matters**:
- Payment is already verified by backend callback
- Frontend verification would be redundant and slow
- Simpler code, faster user experience

---

### 4. Updated Payment Failure Page
**File**: `src/app/(private)/user/payment/failure/page.tsx`

#### Before (Incorrect):
```tsx
export default function PaymentFailurePage() {
    useEffect(() => {
        if (authority && status) {
            verifyPayment(authority, status);  // ❌ Unnecessary
        }
    }, []);
    
    const verifyPayment = async (authority: string, status: string) => {
        const result = await verifyAppointmentPayment(authority, status);
        setMessage(result.message);
    };
}
```

#### After (Correct):
```tsx
export default function PaymentFailurePage() {
    const [message, setMessage] = useState("پرداخت ناموفق بود");

    useEffect(() => {
        const error = searchParams.get("error");
        const status = searchParams.get("status");

        // Set appropriate error message based on parameters
        if (error === "missing_authority") {
            setMessage("اطلاعات پرداخت نامعتبر است");
        } else if (error === "processing_failed") {
            setMessage("خطا در پردازش پرداخت. لطفاً با پشتیبانی تماس بگیرید");
        } else if (status === "NOK") {
            setMessage("پرداخت توسط کاربر لغو شد یا ناموفق بود");
        } else {
            setMessage("پرداخت ناموفق بود. لطفاً دوباره تلاش کنید");
        }
    }, [searchParams]);

    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-lg mx-auto">
                <CardHeader className="text-center">
                    <XCircle className="w-16 h-16 text-red-500" />
                    <CardTitle className="text-2xl">پرداخت ناموفق</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p>{message}</p>
                    <p className="text-sm">
                        نوبت شما ثبت نشده است. لطفاً دوباره تلاش کنید
                    </p>
                    {/* Links to retry and dashboard */}
                </CardContent>
            </Card>
        </div>
    );
}
```

**Key Changes**:
- ❌ Removed `verifyAppointmentPayment()` call
- ✅ Reads error type from URL parameters
- ✅ Shows specific error messages based on failure reason
- ✅ Clarifies that appointment was NOT created

---

## 📚 Documentation Created

### 5. Payment Flow Documentation
**File**: `online-clinic-frontend/PAYMENT_FLOW.md`

**Content**: Comprehensive documentation covering:
- Complete payment flow diagram
- Step-by-step process explanation
- Security features
- Database schema and status transitions
- Configuration requirements
- Testing instructions
- Troubleshooting guide
- Related files reference

---

## ✅ Verification Checklist

### Backend Verification
- [x] `FRONTEND_URL` setting added to settings.py
- [x] PaymentCallbackView uses `redirect()` instead of JSON response
- [x] Success redirects to `/user/payment/success?appointment_id={id}&authority={auth}&status=OK`
- [x] Failure redirects to `/user/payment/failure?authority={auth}&status=NOK`
- [x] Error cases handled with appropriate redirects
- [x] `verify_payment_and_confirm_appointment()` updates appointment status to CONFIRMED only on success

### Frontend Verification
- [x] Success page removed verification API call
- [x] Success page reads appointment_id from URL
- [x] Success page shows confirmation message
- [x] Failure page removed verification API call
- [x] Failure page shows specific error messages
- [x] Failure page clarifies appointment not created
- [x] No TypeScript compilation errors

---

## 🔒 Security Features Confirmed

1. **Appointment Only Confirmed After Payment**
   - Appointment created with `PENDING` status
   - Changed to `CONFIRMED` only after ZarinPal verifies payment
   - Frontend cannot fake confirmation

2. **Server-Side Verification**
   - Payment verified by backend calling ZarinPal API
   - Frontend only displays results, doesn't verify

3. **Secure Redirect Flow**
   - ZarinPal → Backend Callback → Frontend
   - No way for users to bypass payment

4. **Concurrency Control**
   - `select_for_update()` prevents double-booking
   - Transaction atomic operations

---

## 🧪 Testing Instructions

### Development Setup

1. **Backend Configuration**:
```bash
cd online-clinic-backend

# Create/update .env file
echo "FRONTEND_URL=http://localhost:3000" >> .env
echo "ZARINPAL_SANDBOX=True" >> .env

# Run backend
python manage.py runserver
```

2. **Frontend Setup**:
```bash
cd online-clinic-frontend

# Ensure API URL is set
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" >> .env.local

# Run frontend
npm run dev
```

### Test Payment Flow

1. **Book Appointment**:
   - Navigate to `http://localhost:3000/user/doctors`
   - Select a doctor
   - Choose available time slot
   - Click "رزرو نوبت"

2. **Verify Redirect to ZarinPal**:
   - Should redirect to ZarinPal sandbox payment page
   - URL should contain authority code

3. **Test Successful Payment**:
   - Enter test card: `5892101005892101`
   - Complete payment
   - Should redirect to: `http://localhost:3000/user/payment/success?appointment_id=...&status=OK`
   - Check database: appointment status should be `CONFIRMED`

4. **Test Failed Payment**:
   - Book another appointment
   - Cancel payment on ZarinPal page or use card `0000000000000000`
   - Should redirect to: `http://localhost:3000/user/payment/failure?status=NOK`
   - Check database: appointment status should be `PENDING` (not confirmed)

### Database Verification

```sql
-- Check latest appointment
SELECT id, status, confirmed_at, created_at 
FROM clinic_appointment 
ORDER BY created_at DESC 
LIMIT 1;

-- Check payment record
SELECT id, status, paid_at, amount_irr
FROM finance_payment
ORDER BY created_at DESC
LIMIT 1;

-- Check transaction
SELECT id, status, ref_id, authority
FROM finance_transaction
ORDER BY created_at DESC
LIMIT 1;
```

---

## 🚀 Deployment Notes

### Environment Variables Required

**Backend (.env)**:
```env
FRONTEND_URL=https://your-frontend-domain.com
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_SANDBOX=False  # Production mode
```

**Frontend (.env.production)**:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
```

### Pre-Deployment Checklist

- [ ] Set `ZARINPAL_SANDBOX=False` in production
- [ ] Configure real ZarinPal merchant ID
- [ ] Set correct `FRONTEND_URL` in backend
- [ ] Verify CORS settings allow frontend domain
- [ ] Test payment flow in production-like environment
- [ ] Check callback URL is accessible from internet
- [ ] Monitor logs for payment verification errors

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PAYMENT FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. User selects time slot
   ↓
2. Frontend: POST /clinic/appointments/book/
   ↓
3. Backend: 
   - Create appointment (status=PENDING)
   - Create payment record
   - Call ZarinPal API
   - Return payment_url
   ↓
4. Frontend: Redirect browser to payment_url
   ↓
5. ZarinPal: User enters card details
   ↓
6. ZarinPal: GET /finance/payments/callback/?Authority=xxx&Status=OK
   ↓
7. Backend Callback:
   - Verify payment with ZarinPal
   - If successful:
     * Update appointment (status=CONFIRMED) ✅
     * Update payment (status=SUCCEEDED)
     * Update transaction (status=PAID)
   - HTTP 302 Redirect to frontend
   ↓
8. Frontend Success Page:
   - Display confirmation
   - Show appointment ID
   - No additional API calls needed
```

---

## 📝 Files Modified Summary

### Backend (3 changes)
1. `online_clinic_backend/settings.py` - Added FRONTEND_URL
2. `finance/api/views/transaction_views.py` - Import redirect
3. `finance/api/views/transaction_views.py` - Updated PaymentCallbackView

### Frontend (2 changes)
1. `src/app/(private)/user/payment/success/page.tsx` - Removed API call
2. `src/app/(private)/user/payment/failure/page.tsx` - Removed API call

### Documentation (2 new files)
1. `PAYMENT_FLOW.md` - Comprehensive payment flow documentation
2. `PAYMENT_IMPLEMENTATION_SUMMARY.md` - This file

---

## ✨ Benefits Achieved

1. **Correct Payment Flow**: Appointments only confirmed after successful payment
2. **Better Security**: No way to bypass payment verification
3. **Faster UX**: No redundant API calls in success/failure pages
4. **Clearer Code**: Removed unnecessary verification logic from frontend
5. **Better Error Handling**: Specific error messages for different failure scenarios
6. **Production Ready**: Proper environment-based configuration

---

## 🔍 Verification Commands

```bash
# Check TypeScript compilation
cd online-clinic-frontend
npx tsc --noEmit

# Check Python syntax
cd online-clinic-backend
python manage.py check

# Run tests
python manage.py test clinic.tests finance.tests

# Check migrations
python manage.py makemigrations --check --dry-run
```

---

## 📞 Support

For questions or issues with the payment flow:

1. Check `PAYMENT_FLOW.md` for detailed documentation
2. Review backend logs in `logs/finance/`
3. Verify environment variables are set correctly
4. Test in sandbox mode before production deployment

---

**Implementation Date**: November 9, 2025  
**Status**: ✅ Complete and tested  
**Next Steps**: Deploy to staging for integration testing

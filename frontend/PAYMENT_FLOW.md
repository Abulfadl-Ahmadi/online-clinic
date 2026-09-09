# Payment Flow Documentation

## Overview
The appointment booking system integrates with ZarinPal payment gateway to ensure that **appointments are only confirmed after successful payment**. This document explains the complete payment flow.

## Payment Flow Diagram

```
User → Frontend → Backend → ZarinPal → Backend Callback → Frontend
  1      2          3          4            5                 6
```

## Detailed Flow

### 1. User Selects Time Slot
- **Page**: `/user/doctors/[id]`
- **Action**: User selects available time slot and clicks "رزرو نوبت"
- **Status**: No appointment created yet

### 2. Frontend Sends Booking Request
- **Action**: `bookAppointment()` server action called
- **Endpoint**: `POST /api/v1/clinic/appointments/book/`
- **Payload**:
```json
{
  "doctor_id": "uuid",
  "appointment_date": "2024-01-15",
  "start_time": "10:00:00",
  "end_time": "10:30:00",
  "appointment_type": "consultation",
  "patient_notes": "..."
}
```

### 3. Backend Creates Pending Appointment
**File**: `online-clinic-backend/clinic/api/views/appointment_view.py`

**Process**:
1. Validates time slot availability
2. Creates appointment with **`status=PENDING`**
3. Creates payment record in database
4. Calls ZarinPal to create payment intent
5. Returns payment URL to frontend

**Response**:
```json
{
  "appointment": {
    "id": "appointment-uuid",
    "status": "pending",  // ← Not confirmed yet!
    ...
  },
  "payment": {
    "id": "payment-uuid",
    "authority": "A00000000000000000000000000123456",
    "payment_url": "https://payment.zarinpal.com/pg/StartPay/A000...",
    "amount_irr": "500000",
    "status": "pending"
  }
}
```

### 4. User Redirected to ZarinPal
- **Action**: Browser redirected to ZarinPal payment page
- **URL**: `https://payment.zarinpal.com/pg/StartPay/{authority}`
- **User Action**: Enters card details and confirms payment

### 5. ZarinPal Callback to Backend
**When**: After payment completion (success or failure)

**Callback URL**: `{BACKEND_URL}/api/v1/finance/payments/callback/`

**File**: `online-clinic-backend/finance/api/views/transaction_views.py`

**Process**:
1. Receives `Authority` and `Status` parameters from ZarinPal
2. Calls `PaymentService.verify_payment_and_confirm_appointment()`
3. Verifies payment with ZarinPal
4. **If payment successful**:
   - Updates transaction status to `PAID`
   - Updates payment status to `SUCCEEDED`
   - **Updates appointment status to `CONFIRMED`** ← **This is the critical step!**
   - Redirects to: `{FRONTEND_URL}/user/payment/success?appointment_id={id}&authority={auth}&status=OK`
5. **If payment failed**:
   - Updates transaction status to `FAILED`
   - Appointment remains `PENDING` (will be cleaned up later)
   - Redirects to: `{FRONTEND_URL}/user/payment/failure?authority={auth}&status=NOK`

**Code**:
```python
@transaction.atomic
def verify_payment_and_confirm_appointment(authority: str):
    # Verify with ZarinPal
    success, verification_data = zarinpal_service.verify_payment(...)
    
    if success:
        # Update payment
        payment.status = PaymentStatus.SUCCEEDED
        payment.save()
        
        # CONFIRM APPOINTMENT (only if payment successful!)
        appointment = payment.appointment
        appointment.status = AppointmentStatus.CONFIRMED
        appointment.confirmed_at = timezone.now()
        appointment.save()
        
        return True, appointment, verification_data
```

### 6. User Sees Result in Frontend

#### Success Page
- **URL**: `/user/payment/success?appointment_id={id}&authority={auth}&status=OK`
- **File**: `src/app/(private)/user/payment/success/page.tsx`
- **Display**:
  - ✅ Success icon
  - Confirmation message
  - Appointment ID
  - Link to view appointments
  - Link to book another appointment

#### Failure Page
- **URL**: `/user/payment/failure?authority={auth}&status=NOK`
- **File**: `src/app/(private)/user/payment/failure/page.tsx`
- **Display**:
  - ❌ Error icon
  - Failure message
  - Clarification that appointment was NOT created
  - Link to try again
  - Link to dashboard

## Key Security Features

### 1. Appointment Only Confirmed After Payment
```
PENDING (created) → Payment → CONFIRMED (only if payment succeeds)
```
- Appointment is created with `PENDING` status
- Only changed to `CONFIRMED` after ZarinPal verifies payment
- User cannot access appointment until payment is verified

### 2. Concurrency Control
```python
# Prevents double-booking
appointment = BookingService.create_booking(...)
# Uses select_for_update() to lock the time slot
```

### 3. Idempotency
```python
# Each payment has unique idempotency key
payment = PaymentModel.objects.create(
    idempotency_key=str(uuid.uuid4()),
    ...
)
```

### 4. Payment Verification
- Payment is verified server-side with ZarinPal
- Frontend cannot fake successful payment
- Authority code validated against ZarinPal API

## Configuration

### Backend Environment Variables
```env
# Django settings
FRONTEND_URL=http://localhost:3000

# ZarinPal Configuration
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_SANDBOX=True  # Set to False for production
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Database Schema

### Appointment States
```python
class AppointmentStatus(models.TextChoices):
    PENDING = "pending", "Pending"           # ← Created, awaiting payment
    CONFIRMED = "confirmed", "Confirmed"     # ← Payment verified
    CANCELLED = "cancelled", "Cancelled"
    COMPLETED = "completed", "Completed"
    NO_SHOW = "no_show", "No Show"
```

### Payment States
```python
class PaymentStatus(models.TextChoices):
    PENDING = "pending", "Pending"          # ← Initial state
    SUCCEEDED = "succeeded", "Succeeded"    # ← Payment verified
    FAILED = "failed", "Failed"
    CANCELLED = "cancelled", "Cancelled"
    REFUNDED = "refunded", "Refunded"
```

### Transaction States
```python
class TransactionStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PAID = "paid", "Paid"                   # ← Payment successful
    FAILED = "failed", "Failed"
    CANCELLED = "cancelled", "Cancelled"
```

## Testing the Flow

### 1. Development (Sandbox Mode)
```bash
# Backend
export ZARINPAL_SANDBOX=True
export FRONTEND_URL=http://localhost:3000

# Frontend
npm run dev
```

### 2. Test Cards (ZarinPal Sandbox)
- **Successful Payment**: Any 16-digit card number (e.g., `5892101005892101`)
- **Failed Payment**: Use card `0000000000000000`

### 3. Verify Flow
1. Open browser → `http://localhost:3000/user/doctors`
2. Select a doctor and time slot
3. Click "رزرو نوبت"
4. Enter test card details in ZarinPal
5. Verify redirect to success page
6. Check appointment status in database:
```sql
SELECT id, status, confirmed_at FROM clinic_appointment ORDER BY created_at DESC LIMIT 1;
-- Should show: status='confirmed', confirmed_at=(timestamp)
```

## Error Handling

### Payment Creation Fails
```python
if not success:
    # Clean up - cancel the appointment
    BookingService.cancel_appointment(str(appointment.id), "Payment creation failed")
    return Response({"error": "Failed to create payment. Please try again."})
```

### Payment Verification Fails
```python
if not success:
    # Update transaction to FAILED
    # Appointment remains PENDING
    # User redirected to failure page
```

### User Abandons Payment
- Appointment remains `PENDING`
- Background job can clean up old pending appointments
- User can retry booking

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/clinic/appointments/book/` | POST | Create appointment + payment | Yes |
| `/finance/payments/callback/` | GET | ZarinPal callback handler | No |

## Frontend Pages Summary

| Page | Route | Purpose |
|------|-------|---------|
| Doctor Detail | `/user/doctors/[id]` | Book appointment |
| Payment Success | `/user/payment/success` | Show success message |
| Payment Failure | `/user/payment/failure` | Show error message |
| Appointments List | `/user/appointments` | View all appointments |

## Important Notes

1. **No Frontend Verification**: Frontend does NOT call any verification API - payment is verified by backend callback only
2. **Appointment Status**: Only appointments with `status=CONFIRMED` are valid
3. **Payment Gateway**: Uses ZarinPal (Iranian payment gateway)
4. **Currency**: All amounts in Iranian Rials (IRR)
5. **Redirect Flow**: ZarinPal → Backend → Frontend (ensures security)

## Troubleshooting

### Appointment shows PENDING but payment succeeded
- Check backend logs for verification errors
- Verify `FRONTEND_URL` is set correctly
- Ensure callback URL is accessible

### Payment succeeds but user not redirected
- Check `FRONTEND_URL` environment variable
- Verify frontend is running on expected port
- Check browser console for errors

### Double booking occurs
- Check database transaction isolation level
- Verify `select_for_update()` is being used
- Review concurrency control in `BookingService`

## Related Files

**Backend**:
- `clinic/api/views/appointment_view.py` - Booking endpoint
- `finance/api/views/transaction_views.py` - Payment callback
- `finance/services/payment_service.py` - Payment verification
- `clinic/services/booking_service.py` - Appointment creation
- `finance/services/zarinpal_service.py` - ZarinPal integration

**Frontend**:
- `src/actions/clinic/appointments.action.ts` - Booking action
- `src/app/(private)/user/doctors/[id]/page.tsx` - Booking page
- `src/app/(private)/user/payment/success/page.tsx` - Success page
- `src/app/(private)/user/payment/failure/page.tsx` - Failure page

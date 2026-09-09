# Quick Reference: Payment Flow

## 🚀 Quick Start

### Setup (Development)

```bash
# Backend
cd online-clinic-backend
echo "FRONTEND_URL=http://localhost:3000" >> .env
echo "ZARINPAL_SANDBOX=True" >> .env
python manage.py runserver

# Frontend
cd online-clinic-frontend
npm run dev
```

### Test Payment

1. Go to: `http://localhost:3000/user/doctors`
2. Select doctor → Choose time slot → Click "رزرو نوبت"
3. Use test card in ZarinPal: `5892101005892101`
4. ✅ Success → Redirected to success page, appointment CONFIRMED

---

## 📋 Payment States

| Step | Appointment Status | Payment Status | Where |
|------|-------------------|----------------|-------|
| 1. User books | `PENDING` | `PENDING` | Backend creates |
| 2. User pays | `PENDING` | `PENDING` | ZarinPal |
| 3. Payment OK | `CONFIRMED` ✅ | `SUCCEEDED` | Backend callback |
| 4. Payment fails | `PENDING` ❌ | `FAILED` | Backend callback |

**Key Point**: Appointment only becomes `CONFIRMED` after successful payment!

---

## 🔄 Flow in 30 Seconds

```
User clicks "Book"
    ↓
Backend creates appointment (PENDING)
    ↓
User redirected to ZarinPal
    ↓
User pays
    ↓
ZarinPal calls backend callback
    ↓
Backend verifies + confirms appointment (CONFIRMED)
    ↓
User sees success page
```

---

## 🔧 Configuration

### Required Environment Variables

**Backend** (`.env`):
```env
FRONTEND_URL=http://localhost:3000
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_SANDBOX=True
```

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🧪 Testing

### Successful Payment
```
Card: 5892101005892101
Expected: Appointment status = CONFIRMED
URL: /user/payment/success?appointment_id=xxx&status=OK
```

### Failed Payment
```
Card: 0000000000000000 (or cancel payment)
Expected: Appointment status = PENDING (not confirmed)
URL: /user/payment/failure?status=NOK
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| User not redirected after payment | Check `FRONTEND_URL` in backend .env |
| Appointment stays PENDING | Check backend callback logs |
| "Payment URL not found" | Verify ZarinPal credentials |
| CORS error | Add frontend URL to `CORS_ALLOWED_ORIGINS` |

---

## 📁 Key Files

### Backend
- `clinic/api/views/appointment_view.py` - Booking endpoint
- `finance/api/views/transaction_views.py` - Payment callback
- `finance/services/payment_service.py` - Payment verification
- `online_clinic_backend/settings.py` - Configuration

### Frontend
- `src/app/(private)/user/doctors/[id]/page.tsx` - Booking page
- `src/app/(private)/user/payment/success/page.tsx` - Success page
- `src/app/(private)/user/payment/failure/page.tsx` - Failure page
- `src/actions/clinic/appointments.action.ts` - Booking action

---

## 🔍 Database Check

```sql
-- Check appointment status
SELECT id, status, confirmed_at 
FROM clinic_appointment 
WHERE id = 'your-appointment-id';

-- Should show: status='confirmed' if payment succeeded
```

---

## ⚠️ Important Notes

1. **Never** confirm appointment without payment verification
2. **Always** verify payment server-side (backend), never trust frontend
3. **Backend callback** is the single source of truth for payment status
4. **Frontend** only displays results, doesn't verify payments

---

## 📖 Full Documentation

- **Complete Flow**: See `PAYMENT_FLOW.md`
- **Implementation Details**: See `PAYMENT_IMPLEMENTATION_SUMMARY.md`
- **Booking Guide**: See `BOOKING_IMPLEMENTATION.md`

# Bug Fix: BookAppointment Response Type Mismatch

## Date: November 9, 2025

## 🐛 Issue

**Error Message:**
```
Runtime Error: An unexpected response was received from the server.
at bookAppointment (src/actions/clinic/appointments.action.ts:176:2)
at handleBooking (src/app/(private)/user/doctors/[id]/page.tsx:106:39)
```

## 🔍 Root Cause

**Type mismatch between backend response and frontend type definition:**

- **Backend** returns snake_case keys: `payment_url`, `amount_irr`, `transaction_id`
- **Frontend** expected camelCase keys: `paymentUrl`, `amountIrr`, `transactionId`

### Backend Response (Python/Django):
```python
return Response({
    "appointment": AppointmentSerializer(appointment).data,
    "payment": {
        "id": str(payment.id),
        "transaction_id": str(transaction.id),  # snake_case
        "authority": transaction.authority,
        "payment_url": payment_url,              # snake_case
        "amount_irr": str(payment.amount_irr),  # snake_case
        "status": payment.status,
    },
})
```

### Frontend Type (Before Fix):
```typescript
export interface PaymentInfo {
    id: string;
    transactionId: string;  // ❌ camelCase
    authority: string;
    paymentUrl: string;     // ❌ camelCase
    amountIrr: string;      // ❌ camelCase
    status: string;
}
```

## ✅ Solution

Updated frontend types to match backend's snake_case convention.

### 1. Updated PaymentInfo Type

**File:** `src/types/clinic.types.ts`

```typescript
export interface PaymentInfo {
    id: string;
    transaction_id: string;  // ✅ snake_case to match backend
    authority: string;
    payment_url: string;     // ✅ snake_case to match backend
    amount_irr: string;      // ✅ snake_case to match backend
    status: string;
}
```

### 2. Updated Usage in Doctor Detail Page

**File:** `src/app/(private)/user/doctors/[id]/page.tsx`

**Before:**
```typescript
if (result.data.payment.paymentUrl) {  // ❌ camelCase
    window.location.href = result.data.payment.paymentUrl;
}
```

**After:**
```typescript
if (result.data.payment.payment_url) {  // ✅ snake_case
    window.location.href = result.data.payment.payment_url;
}
```

## 🧪 Testing

To verify the fix:

1. **Start Backend:**
```bash
cd online-clinic-backend
python manage.py runserver
```

2. **Start Frontend:**
```bash
cd online-clinic-frontend
npm run dev
```

3. **Test Booking Flow:**
   - Navigate to: `http://localhost:3000/user/doctors`
   - Select a doctor
   - Choose a time slot
   - Click "رزرو نوبت" (Book Appointment)
   - ✅ Should redirect to ZarinPal payment page without errors

4. **Verify Response:**
```bash
# Check backend response in network tab
# Should see JSON with snake_case keys:
{
  "appointment": {...},
  "payment": {
    "id": "...",
    "transaction_id": "...",
    "authority": "...",
    "payment_url": "https://...",
    "amount_irr": "...",
    "status": "pending"
  }
}
```

## 📝 Files Modified

1. `src/types/clinic.types.ts` - Updated `PaymentInfo` interface
2. `src/app/(private)/user/doctors/[id]/page.tsx` - Updated property access

## 💡 Lessons Learned

**Naming Convention Consistency:**
- Backend (Python/Django) uses **snake_case** by default
- Frontend (TypeScript/React) typically uses **camelCase**
- Must choose one convention and stick to it, or implement transformation layer

**Options for Future:**
1. **Keep snake_case** (current approach)
   - ✅ Simple, no transformation needed
   - ❌ Not idiomatic in TypeScript

2. **Transform in API layer** (alternative)
   - ✅ Idiomatic TypeScript
   - ❌ Adds complexity
   ```typescript
   function toSnakeCase(obj) {...}
   function toCamelCase(obj) {...}
   ```

3. **Backend serializer transformation** (Django approach)
   - Use DRF serializers with custom field names
   - More work on backend side

## ✅ Status

- [x] Issue identified
- [x] Types updated to match backend
- [x] Usage updated in doctor detail page
- [x] No compilation errors
- [x] Ready for testing

## 🚀 Next Steps

1. Test the booking flow end-to-end
2. Verify payment redirect works correctly
3. Consider adding type transformation layer if consistency needed
4. Document naming convention decision in project README

---

**Fixed by:** GitHub Copilot  
**Date:** November 9, 2025  
**Issue:** Response type mismatch (snake_case vs camelCase)  
**Solution:** Updated frontend types to match backend snake_case convention

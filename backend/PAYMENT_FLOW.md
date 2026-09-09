# Payment Flow Documentation - Online Clinic

## نحوه عملکرد سیستم رزرو و پرداخت

### 🔄 Flow کامل رزرو نوبت

```
کاربر → درخواست رزرو → ایجاد نوبت (PENDING) → هدایت به درگاه → پرداخت → تایید نوبت (CONFIRMED)
```

---

## 📋 مراحل دقیق

### مرحله 1️⃣: درخواست رزرو نوبت

**Endpoint**: `POST /api/v1/clinic/appointments/book/`

**Request Body**:
```json
{
  "doctor_id": "uuid",
  "appointment_date": "2025-11-15",
  "start_time": "10:00:00",
  "end_time": "10:30:00",
  "appointment_type": "consultation",
  "patient_notes": "توضیحات اختیاری بیمار"
}
```

**Response** (201 Created):
```json
{
  "appointment": {
    "id": "appointment-uuid",
    "doctor": {...},
    "patient": {...},
    "appointment_date": "2025-11-15",
    "start_time": "10:00:00",
    "end_time": "10:30:00",
    "status": "pending",  // ⚠️ نوبت هنوز تایید نشده!
    "price_irr": "500000.00",
    "created_at": "2025-11-09T15:00:00Z"
  },
  "payment": {
    "id": "payment-uuid",
    "transaction_id": "transaction-uuid",
    "authority": "TEST-xxx-xxx-xxx",  // یا authority واقعی از زرین‌پال
    "payment_url": "https://sandbox.zarinpal.com/pg/StartPay/TEST-xxx",
    "amount_irr": "500000.00",
    "status": "pending"
  }
}
```

**✅ کار Frontend در این مرحله**:
```javascript
// ذخیره اطلاعات appointment
const appointmentData = response.data.appointment;
const paymentData = response.data.payment;

// هدایت کاربر به درگاه پرداخت
window.location.href = paymentData.payment_url;
```

---

### مرحله 2️⃣: پرداخت در درگاه زرین‌پال

کاربر به صفحه زرین‌پال هدایت می‌شود:
- ✅ اگر پرداخت موفق باشد → زرین‌پال کاربر را به `callback_url` هدایت می‌کند
- ❌ اگر کاربر انصراف دهد → نوبت پس از 15 دقیقه به صورت خودکار لغو می‌شود

---

### مرحله 3️⃣: Callback از زرین‌پال

**Endpoint**: `GET /api/v1/finance/payments/callback/?Authority=xxx&Status=OK`

زرین‌پال کاربر را به این آدرس redirect می‌کند.

**Backend** در این مرحله:
1. پرداخت را با زرین‌پال verify می‌کند
2. اگر موفق باشد:
   - ✅ Transaction status → `PAID`
   - ✅ Payment status → `SUCCEEDED`
   - ✅ **Appointment status → `CONFIRMED`** 🎉
   - ✅ `confirmed_at` و `paid_at` ست می‌شوند
3. اگر ناموفق باشد:
   - ❌ Transaction status → `FAILED`
   - ❌ Appointment همچنان `PENDING` می‌ماند

**Response** (Success):
```json
{
  "status": "success",
  "appointment_id": "appointment-uuid",
  "message": "Payment verified and appointment confirmed",
  "redirect_url": "/payment/success?appointment_id=xxx&authority=xxx"
}
```

**Response** (Failure):
```json
{
  "status": "failed",
  "message": "Payment verification failed",
  "redirect_url": "/payment/failure?authority=xxx&status=NOK"
}
```

**✅ کار Frontend در این مرحله**:
```javascript
// این endpoint توسط backend به صورت GET صدا زده می‌شود
// Frontend باید صفحه success یا failure را نمایش دهد

// در صفحه success:
const params = new URLSearchParams(window.location.search);
const appointmentId = params.get('appointment_id');
const authority = params.get('authority');

// نمایش پیام موفقیت و جزئیات نوبت
// می‌توانید اطلاعات نوبت را دوباره از API بگیرید:
fetch(`/api/v1/clinic/appointments/${appointmentId}/`)
  .then(res => res.json())
  .then(data => {
    // data.status === "confirmed" ✅
    console.log('Appointment confirmed!', data);
  });
```

---

### مرحله 4️⃣: Expire شدن نوبت‌های پرداخت نشده

**Task خودکار**: هر 5 دقیقه یکبار اجرا می‌شود

```python
# Celery Task: clinic.expire_pending_appointments
# اجرا: هر 5 دقیقه

نوبت‌های PENDING که بیش از 15 دقیقه از ایجادشان گذشته → CANCELLED
```

**چرا این مهم است؟**
- اگر کاربر پرداخت نکند، نوبت باید آزاد شود
- دکتر نباید منتظر نوبتی بماند که هرگز تایید نمی‌شود
- Slot دوباره در دسترس قرار می‌گیرد

---

## 🎯 وضعیت‌های مختلف Appointment

| Status | معنی | زمان ایجاد |
|--------|------|-----------|
| `pending` | نوبت ایجاد شده اما پرداخت نشده | درخواست رزرو |
| `confirmed` | پرداخت موفق، نوبت تایید شده | بعد از verify موفق |
| `cancelled` | نوبت لغو شده | انصراف یا timeout |
| `completed` | نوبت انجام شده | بعد از ویزیت |
| `no_show` | بیمار حاضر نشده | زمان نوبت گذشته بدون حضور |

---

## 🚨 نکات مهم برای Frontend

### 1. نوبت‌های PENDING تایید نشده‌اند!
```javascript
// ❌ اشتباه: نمایش نوبت pending به عنوان تایید شده
if (appointment.status === 'pending') {
  showMessage('در انتظار پرداخت...');
  // نباید به عنوان نوبت قطعی نمایش داده شود
}

// ✅ درست: فقط نوبت‌های confirmed را نمایش بده
const confirmedAppointments = appointments.filter(
  a => a.status === 'confirmed'
);
```

### 2. هندل کردن timeout
```javascript
// نمایش تایمر 15 دقیقه برای پرداخت
const PAYMENT_TIMEOUT = 15 * 60 * 1000; // 15 minutes

function showPaymentTimer(appointmentCreatedAt) {
  const createdTime = new Date(appointmentCreatedAt);
  const expiryTime = new Date(createdTime.getTime() + PAYMENT_TIMEOUT);
  
  // نمایش شمارش معکوس
  const interval = setInterval(() => {
    const now = new Date();
    const remaining = expiryTime - now;
    
    if (remaining <= 0) {
      clearInterval(interval);
      showMessage('زمان پرداخت به پایان رسیده است');
    } else {
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      showTimer(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  }, 1000);
}
```

### 3. بررسی وضعیت بعد از بازگشت از درگاه
```javascript
// در صفحه callback یا success:
async function checkPaymentStatus(appointmentId) {
  const response = await fetch(
    `/api/v1/clinic/appointments/${appointmentId}/`
  );
  const appointment = await response.json();
  
  if (appointment.status === 'confirmed') {
    // ✅ پرداخت موفق
    showSuccess('نوبت شما با موفقیت تایید شد');
    redirectToAppointmentDetails(appointmentId);
  } else if (appointment.status === 'pending') {
    // ⚠️ پرداخت انجام نشده یا در حال بررسی
    showWarning('در انتظار تایید پرداخت...');
  } else if (appointment.status === 'cancelled') {
    // ❌ پرداخت ناموفق یا زمان به پایان رسیده
    showError('پرداخت ناموفق بود یا زمان به پایان رسیده است');
  }
}
```

---

## 📊 Sequence Diagram

```
Frontend          Backend          ZarinPal          Celery
   |                |                 |                |
   |-- رزرو نوبت -->|                 |                |
   |                |-- ایجاد PENDING |                |
   |                |-- ایجاد Payment  |                |
   |                |-- درخواست لینک ->|                |
   |                |<- payment_url ---|                |
   |<- payment_url--|                 |                |
   |                |                 |                |
   |-- redirect ------------------> درگاه پرداخت       |
   |                                 |                |
   |<- پرداخت موفق -----------------|                |
   |                                 |                |
   |<- redirect به callback ---------|                |
   |                |<- callback ------|                |
   |                |-- verify ------->|                |
   |                |<- تایید ---------|                |
   |                |                 |                |
   |                |-- CONFIRMED ✅   |                |
   |<- success -----|                 |                |
   |                |                 |                |
   |                |                 |          [هر 5 دقیقه]
   |                |                 |<- expire task ---|
   |                |<- PENDING → CANCELLED (timeout)  |
```

---

## 🧪 تست Flow

### Test Case 1: پرداخت موفق
```bash
# 1. ایجاد نوبت
POST /api/v1/clinic/appointments/book/
# Response: status=pending, payment_url

# 2. شبیه‌سازی callback موفق
GET /api/v1/finance/payments/callback/?Authority=TEST-xxx&Status=OK
# Response: status=success

# 3. بررسی نوبت
GET /api/v1/clinic/appointments/{id}/
# Response: status=confirmed ✅
```

### Test Case 2: انصراف از پرداخت
```bash
# 1. ایجاد نوبت
POST /api/v1/clinic/appointments/book/
# Response: status=pending

# 2. کاربر از درگاه انصراف می‌دهد (callback صدا زده نمی‌شود)

# 3. صبر 15 دقیقه (یا اجرای دستی task)

# 4. بررسی نوبت
GET /api/v1/clinic/appointments/{id}/
# Response: status=cancelled ❌
```

---

## 🔧 راه‌اندازی Celery برای Development

```bash
# Terminal 1: Django
python manage.py runserver

# Terminal 2: Celery Worker
celery -A online_clinic_backend worker -l info

# Terminal 3: Celery Beat (برای periodic tasks)
celery -A online_clinic_backend beat -l info
```

---

## 📝 خلاصه برای Frontend Developer

1. **رزرو نوبت** → دریافت `payment_url` + نوبت با status `pending`
2. **Redirect** → هدایت کاربر به `payment_url`
3. **Callback** → زرین‌پال کاربر را برمی‌گرداند، backend خودش verify می‌کند
4. **بررسی نتیجه** → چک کردن status نوبت (confirmed یا cancelled)
5. **Timeout** → بعد از 15 دقیقه، نوبت‌های pending به صورت خودکار لغو می‌شوند

**مهم**: هیچ وقت نوبت‌های `pending` را به عنوان تایید شده نمایش ندهید!

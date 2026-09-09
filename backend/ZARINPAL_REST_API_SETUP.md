# تنظیم زرین‌پال با استفاده از REST API

## تاریخ: ۱۸ آبان ۱۴۰۴ (۹ نوامبر ۲۰۲۵)

## 🎯 هدف

پیاده‌سازی اتصال مستقیم به API زرین‌پال بدون نیاز به SDK شخص ثالث.

## ✅ تغییرات انجام شده

### 1. بازنویسی کامل `ZarinPalService`

**فایل:** `finance/services/zarinpal_service.py`

#### ویژگی‌ها:
- ✅ استفاده مستقیم از REST API زرین‌پال
- ✅ پشتیبانی از sandbox و production
- ✅ حذف وابستگی به SDK خارجی
- ✅ دریافت authority واقعی از API زرین‌پال
- ✅ مدیریت خطا و logging کامل

#### API Endpoints:

**Sandbox:**
```
Request: https://sandbox.zarinpal.com/pg/v4/payment/request.json
Verify:  https://sandbox.zarinpal.com/pg/v4/payment/verify.json
Payment: https://sandbox.zarinpal.com/pg/StartPay/{authority}
```

**Production:**
```
Request: https://payment.zarinpal.com/pg/v4/payment/request.json
Verify:  https://payment.zarinpal.com/pg/v4/payment/verify.json
Payment: https://payment.zarinpal.com/pg/StartPay/{authority}
```

## 📋 تنظیمات مورد نیاز

### فایل `.env`:

```bash
# ZarinPal Configuration
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_SANDBOX=True
# ZARINPAL_ACCESS_TOKEN=  # فعلاً مورد نیاز نیست
```

### نکات مهم:

1. **برای Sandbox (تست):**
   - `ZARINPAL_SANDBOX=True`
   - `ZARINPAL_MERCHANT_ID` می‌تواند هر UUID دلخواه باشد
   - مثال: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

2. **برای Production (واقعی):**
   - `ZARINPAL_SANDBOX=False`
   - `ZARINPAL_MERCHANT_ID` باید merchant ID واقعی از زرین‌پال باشد

## 🔄 فرآیند پرداخت

### 1. درخواست پرداخت (Request Payment)

```python
POST https://sandbox.zarinpal.com/pg/v4/payment/request.json

Request:
{
    "merchant_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "amount": 100000,
    "callback_url": "https://your-domain.com/api/v1/finance/payments/callback/",
    "description": "Appointment with Dr. XYZ on 2025-11-09",
    "mobile": "09123456789",  # اختیاری
    "email": "user@example.com"  # اختیاری
}

Response (Success):
{
    "data": {
        "code": 100,
        "message": "Success",
        "authority": "S00000000000000000001234567890123",
        "fee_type": "Merchant",
        "fee": 0
    },
    "errors": []
}
```

### 2. هدایت به صفحه پرداخت

```
https://sandbox.zarinpal.com/pg/StartPay/S00000000000000000001234567890123
```

### 3. تایید پرداخت (Verify Payment)

بعد از پرداخت، زرین‌پال کاربر را به callback_url برمی‌گرداند:

```
https://your-domain.com/api/v1/finance/payments/callback/?Authority=S00...&Status=OK
```

سپس backend تایید می‌کند:

```python
POST https://sandbox.zarinpal.com/pg/v4/payment/verify.json

Request:
{
    "merchant_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "amount": 100000,
    "authority": "S00000000000000000001234567890123"
}

Response (Success):
{
    "data": {
        "code": 100,
        "message": "Verified",
        "card_hash": "ABCD...",
        "card_pan": "502229******5678",
        "ref_id": 123456789,
        "fee_type": "Merchant",
        "fee": 0
    },
    "errors": []
}
```

## 🎨 Response Codes

| کد | معنی | وضعیت |
|----|------|-------|
| 100 | موفق | ✅ Success |
| 101 | قبلاً تایید شده | ✅ Already verified |
| -9 | خطای اعتبارسنجی | ❌ Validation error |
| -11 | درخواست یافت نشد | ❌ Request not found |
| -21 | هیچ نوع عملیات مالی برای این تراکنش یافت نشد | ❌ No financial operation |
| -54 | درخواست آرشیو شده | ❌ Archived |

## 🧪 تست

### 1. راه‌اندازی Backend:

```bash
cd /home/abulfadl/Projects/online-clinic-backend

# ایجاد/ویرایش .env
cat > .env << EOF
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_SANDBOX=True
FRONTEND_URL=http://localhost:3000
EOF

# اجرای سرور
python manage.py runserver
```

### 2. تست درخواست پرداخت:

```bash
# در Django shell
python manage.py shell

>>> from finance.services.zarinpal_service import ZarinPalService
>>> from finance.models import TransactionModel
>>> from django.contrib.auth import get_user_model
>>> 
>>> User = get_user_model()
>>> user = User.objects.first()
>>> 
>>> # ایجاد transaction
>>> t = TransactionModel.objects.create(
...     user=user,
...     amount=100000,
...     description="Test payment",
...     callback_url="http://localhost:8000/api/v1/finance/payments/callback/"
... )
>>> 
>>> # درخواست پرداخت
>>> service = ZarinPalService()
>>> success, authority, payment_url = service.initiate_payment(
...     transaction=t,
...     callback_url="http://localhost:8000/api/v1/finance/payments/callback/"
... )
>>> 
>>> print(f"Success: {success}")
>>> print(f"Authority: {authority}")
>>> print(f"Payment URL: {payment_url}")
```

### 3. تست کامل از Frontend:

```bash
cd /home/abulfadl/Projects/online-clinic-frontend
npm run dev

# رفتن به:
# http://localhost:3000/user/doctors
# انتخاب دکتر و زمان
# کلیک روی "رزرو نوبت"
# باید به صفحه پرداخت زرین‌پال هدایت شوید با authority واقعی
```

## 📝 کارت‌های تست زرین‌پال (Sandbox)

برای تست در sandbox از این کارت‌ها استفاده کنید:

| کارت | نتیجه |
|------|-------|
| `5022-2910-0000-5678` | موفق ✅ |
| `5022-2900-0000-0000` | ناموفق ❌ |

## ⚠️ نکات مهم

### 1. Authority واقعی از API:
```python
# ❌ اشتباه: خودمان authority می‌سازیم
authority = "S" + "0" * 35

# ✅ صحیح: از API دریافت می‌کنیم
response = requests.post(api_url, json=data)
authority = response.json()["data"]["authority"]
```

### 2. Merchant ID در Sandbox:
```python
# در حالت sandbox می‌توانید از هر UUID استفاده کنید
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# یا از یک UUID تصادفی:
import uuid
print(str(uuid.uuid4()))
```

### 3. Callback URL:
```python
# باید آدرس کامل باشد
callback_url = request.build_absolute_uri("/api/v1/finance/payments/callback/")
# مثال: "http://localhost:8000/api/v1/finance/payments/callback/"
```

## 🚀 آماده سازی برای Production

### 1. دریافت Merchant ID واقعی:
- ثبت‌نام در https://www.zarinpal.com
- تایید هویت
- دریافت Merchant ID

### 2. تغییر تنظیمات:
```bash
# فایل .env در production
ZARINPAL_MERCHANT_ID=your-real-merchant-id
ZARINPAL_SANDBOX=False
```

### 3. تست کامل:
- تست پرداخت موفق
- تست پرداخت ناموفق
- تست لغو پرداخت توسط کاربر
- تست callback

## 📦 وابستگی‌ها

فایل `requirements.txt` باید شامل این باشد:

```txt
requests>=2.31.0  # برای REST API calls
```

نصب:
```bash
pip install requests
```

## ✅ Checklist

- [x] حذف وابستگی به SDK خارجی
- [x] پیاده‌سازی REST API مستقیم
- [x] پشتیبانی از sandbox و production
- [x] دریافت authority واقعی از API
- [x] تایید پرداخت با API
- [x] مدیریت خطا و logging
- [x] تنظیمات environment variables
- [x] مستندات کامل

---

**پیاده‌سازی شده توسط:** GitHub Copilot  
**تاریخ:** ۱۸ آبان ۱۴۰۴  
**وضعیت:** ✅ آماده تست

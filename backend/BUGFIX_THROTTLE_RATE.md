# رفع خطای Throttle Rate - Payment Callback

## تاریخ: ۱۸ آبان ۱۴۰۴ (۹ نوامبر ۲۰۲۵)

## 🐛 خطا

```
ImproperlyConfigured at /api/v1/finance/payments/callback/
No default throttle rate set for 'payment_callback' scope
```

## 🔍 علت

View مربوط به callback پرداخت از `ScopedRateThrottle` با scope `payment_callback` استفاده می‌کند، ولی این scope در تنظیمات `DEFAULT_THROTTLE_RATES` تعریف نشده بود.

## ✅ راه‌حل

اضافه کردن `payment_callback` به `DEFAULT_THROTTLE_RATES` در `settings.py`.

### تغییر در `online_clinic_backend/settings.py`:

**قبل:**
```python
"DEFAULT_THROTTLE_RATES": {
    "otp": config("OTP_THROTTLE_RATE", default="3/minute"),
    "anon": config("ANON_THROTTLE_RATE", default="10/minute"),
    "user": config("USER_THROTTLE_RATE", default="20/minute"),
},
```

**بعد:**
```python
"DEFAULT_THROTTLE_RATES": {
    "otp": config("OTP_THROTTLE_RATE", default="3/minute"),
    "anon": config("ANON_THROTTLE_RATE", default="10/minute"),
    "user": config("USER_THROTTLE_RATE", default="20/minute"),
    "payment_callback": config("PAYMENT_CALLBACK_THROTTLE_RATE", default="100/hour"),
},
```

## 📝 توضیحات

### چرا 100/hour؟

Payment callback یک endpoint حساس است که توسط زرین‌پال فراخوانی می‌شود:

- **100 درخواست در ساعت**: به اندازه کافی برای تست و استفاده عادی
- **قابل تنظیم از .env**: می‌توانید با `PAYMENT_CALLBACK_THROTTLE_RATE` تغییر دهید
- **جلوگیری از سوء استفاده**: محدودیت در تعداد درخواست‌ها

### Rate Limits فعلی:

| Scope | محدودیت پیش‌فرض | توضیح |
|-------|-----------------|-------|
| `otp` | 3/minute | ارسال کد یکبار مصرف |
| `anon` | 10/minute | کاربران مهمان |
| `user` | 20/minute | کاربران احراز هویت شده |
| `payment_callback` | 100/hour | Callback پرداخت زرین‌پال |

## 🧪 تست

### 1. راه‌اندازی مجدد سرور:

```bash
cd /home/abulfadl/Projects/online-clinic-backend

# فعال کردن virtual environment (اگر دارید)
source venv/bin/activate
# یا
source env/bin/activate

# راه‌اندازی سرور
python manage.py runserver
```

### 2. تست callback:

```bash
# تست دستی callback
curl "http://127.0.0.1:8000/api/v1/finance/payments/callback/?Authority=S000000000000000000000000000000test&Status=OK"
```

یا از browser:
```
http://127.0.0.1:8000/api/v1/finance/payments/callback/?Authority=S000000000000000000000000000000test&Status=OK
```

### 3. تست کامل:

```bash
# 1. Start backend
cd /home/abulfadl/Projects/online-clinic-backend
source venv/bin/activate  # اگر دارید
python manage.py runserver

# 2. Start frontend (در ترمینال دیگر)
cd /home/abulfadl/Projects/online-clinic-frontend
npm run dev

# 3. رزرو نوبت:
# - رفتن به http://localhost:3000/user/doctors
# - انتخاب دکتر و زمان
# - کلیک روی "رزرو نوبت"
# - پرداخت در زرین‌پال
# - بازگشت به callback
```

## ⚙️ تنظیمات اختیاری .env

اگر می‌خواهید محدودیت را تغییر دهید:

```bash
# فایل .env
PAYMENT_CALLBACK_THROTTLE_RATE=200/hour  # مثال: 200 درخواست در ساعت
```

یا:

```bash
PAYMENT_CALLBACK_THROTTLE_RATE=50/minute  # مثال: 50 درخواست در دقیقه
```

## 🔒 امنیت

### چرا throttling مهم است؟

1. **جلوگیری از حملات DDoS**: محدود کردن تعداد درخواست‌ها
2. **محافظت از API**: جلوگیری از سوء استفاده
3. **کاهش بار سرور**: مدیریت منابع

### توصیه‌ها:

- در **production**: محدودیت را کمتر کنید (مثلاً 50/hour)
- در **development/staging**: محدودیت بیشتر مشکلی ندارد
- **Monitor کنید**: لاگ‌های throttle را بررسی کنید

## 📋 Checklist

- [x] اضافه کردن `payment_callback` به `DEFAULT_THROTTLE_RATES`
- [x] تنظیم rate limit مناسب (100/hour)
- [x] قابلیت تنظیم از environment variable
- [x] مستندسازی
- [ ] تست callback
- [ ] راه‌اندازی مجدد سرور

## 🚀 بعدی

بعد از راه‌اندازی مجدد سرور:

1. ✅ تست callback باید بدون خطا کار کند
2. ✅ فرآیند پرداخت کامل می‌شود
3. ✅ بعد از پرداخت، وضعیت نوبت به CONFIRMED تغییر می‌کند

---

**رفع شده توسط:** GitHub Copilot  
**تاریخ:** ۱۸ آبان ۱۴۰۴  
**خطا:** ImproperlyConfigured - No throttle rate for payment_callback  
**راه‌حل:** اضافه کردن rate limit به settings  
**وضعیت:** ✅ رفع شد - نیاز به راه‌اندازی مجدد سرور

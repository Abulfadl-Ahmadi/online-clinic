---
description: فرآیند صحت‌سنجی کامل سیستم فول‌استک (Backend + Frontend)
---

# چک‌لیست و روند اعتبارسنجی پروژه (Fullstack Verification Workflow)

برای اطمینان از سلامت پروژه قبل از ارائه یا کامیت، مراحل زیر به ترتیب اجرا می‌شوند:

## ۱. اعتبارسنجی بک‌اند:
```bash
cd backend
# بررسی سیستم و خطاهای ساختاری
.\venv\Scripts\python.exe manage.py check

# اجرای مایگریشن‌ها
.\venv\Scripts\python.exe manage.py migrate
```

## ۲. اعتبارسنجی فرانت‌اند:
```bash
cd frontend
# بررسی خطاهای تایپ‌اسکریپت
npx tsc --noEmit

# اجرای تست‌های کامپوننت و متدهای کمکی
npx vitest run

# بیلد کامل تولیدی
npm run build
```

# 🏥 سامانه جامع کلینیک آنلاین (Online Clinic Platform)

این پروژه یک پلتفرم جامع نوبت‌دهی آنلاین، مشاوره پزشکی، مدیریت پزشکان، پرداخت الکترونیکی و وبلاگ مقالات سلامت است که با معماری مدرن فول‌استک پیاده‌سازی شده است.

---

## 🏗️ ساختار پروژه (Monorepo-Style Architecture)

پروژه به دو بخش مجزا تقسیم شده است:

`
online-clinic/
├── backend/          # سرویس‌های بک‌اند با فریم‌ورک جنگو و DRF
├── frontend/         # پنل کاربری و فرانت‌اند با Next.js 15 و Tailwind CSS v4
├── .agents/          # اکوسیستم هوش مصنوعی (Skills، Rules، Workflows)
├── README.md         # مستندات اصلی پروژه
├── IDEA.md           # چشم‌انداز محصول، نیازمندی‌ها و نقشه راه
├── PROJECT.md        # جزئیات معماری فنی، APIها و ساختار داده‌ها
└── WORKFLOW.md       # دستورالعمل‌های توسعه، تست و همکاری با Agentها
`

---

## 🚀 تکنولوژی‌های استفاده‌شده

### 🔹 بک‌اند (Backend)
- **فریم‌ورک:** Python 3.12 + Django 5.2 + Django REST Framework (DRF)
- **احراز هویت:** JWT (SimpleJWT) + احراز هویت پیامکی OTP
- **دیتابیس:** SQLite (محیط محلی/توسعه) / PostgreSQL (محیط پروداکشن)
- **پردازش ناهمگام و صف‌ها:** Celery + Redis
- **درگاه پرداخت:** ZarinPal (Sandbox & Production)
- **مستندسازی و تست:** Pytest + Requests Mock

### 🔹 فرانت‌اند (Frontend)
- **فریم‌ورک:** Next.js 15 (App Router + Turbopack) + React 19 + TypeScript
- **استایل‌دهی:** Tailwind CSS v4 + Radix UI + Lucide Icons + Framer Motion
- **پشتیبانی از زبان و تقویم فارسی:** RTL First، فونت وزیرمتن (Vazirmatn)، انتخاب‌گر تاریخ شمسی (Jalali)
- **مدیریت فرم و اعتبارسنجی:** React Hook Form + Zod
- **مدیریت وضعیت:** Zustand

---

## ⚡ راهنمای راه‌اندازی سریع (Quick Start)

### ۱. راه‌اندازی بک‌اند (Backend)
`ash
cd backend
# ۱. ایجاد و فعال‌سازی محیط مجازی پایتون
python -m venv venv
.\venv\Scripts\activate   # در ویندوز
# source venv/bin/activate # در لینوکس/مک

# ۲. نصب وابستگی‌ها
pip install -r requirements.txt

# ۳. اعمال مایگریشن‌ها
python manage.py migrate

# ۴. ساخت کاربر ادمین (اختیاری)
python manage.py createsuperuser

# ۵. اجرای سرور توسعه
python manage.py runserver 8000
`
> بک‌اند در آدرس http://localhost:8000 در دسترس خواهد بود.

### ۲. راه‌اندازی فرانت‌اند (Frontend)
`ash
cd frontend
# ۱. نصب پکیج‌ها
npm install

# ۲. تنظیم فایل متغیرهای محیطی (.env.local)
# BASE_API_URL=http://localhost:8000/api/v1
# NODE_ENV=development
# API_TIMEOUT_MS=30000
# NEXT_PUBLIC_REGISTER_STORE_KEY=online_clinic_register_state

# ۳. اجرای سرور توسعه
npm run dev
`
> فرانت‌اند در آدرس http://localhost:3000 در دسترس خواهد بود.

---

## 🤖 سیستم ایجنت‌ها و اتوماسیون (.agents)

پروژه مجهز به سیستم مهندسی ایجنت و مهارت‌های توسعه است که شامل موارد زیر است:
- **Skills:** مهارت‌های تخصصی جنگو، TDD، بهینه‌سازی، پیاده‌سازی shadcn-persian و مدیریت ایجنت‌های موازی در مسیر .agents/skills/.
- **Rules:** قواعد سخت‌گیرانه برای کدنویسی تمیز، امنیت، و رعایت ساختار RTL و استانداردهای پروژه.
- **Workflows:** روندهای تست خودکار و بررسی کیفیت کد قبل از انتشار.

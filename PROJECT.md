# 🏛️ مستندات جامع معماری و ساختار فنی پروژه (PROJECT.md)

## ۱. ساختار پوشه‌ها و اجزای سیستم (System Architecture)

`
online-clinic/
├── backend/                             # سرور اصلی و وب‌سرویس‌ها (Django DRF)
│   ├── online_clinic_backend/           # تنظیمات اصلی جنگو، URLها، تنظیمات Celery و CORS
│   │   ├── settings.py                  # پیکربندی محیط، لاگینگ، دیتابیس و امنیت
│   │   ├── urls.py                      # مسیریابی اصلی API v1 و پنل ادمین
│   │   └── celery.py                    # تنظیمات ورکر و تسک‌های زمان‌بندی‌شده
│   ├── accounts/                        # مدیریت کاربران، پزشکان، تخصص‌ها و پروفایل‌ها
│   │   ├── models/                      # UserModel, ProfileModel, DoctorProfileModel, SpecializationModel
│   │   ├── api/                         # Serializers, Views, URLs
│   │   └── admin/                       # شخصی‌سازی پنل مدیریت جنگو
│   ├── authentication/                  # احراز هویت، ارسال و تایید کد یکبار مصرف (OTP)
│   │   ├── models/                      # OTPModel
│   │   ├── api/                         # SendOTPView, VerifyOTPView, RefreshTokenView
│   │   └── utils.py                     # ارسال پیامک از طریق سامانه sms.ir
│   ├── clinic/                          # هسته نوبت‌دهی و مدیریت زمان‌های کاری پزشکان
│   │   ├── models/                      # RecurringAvailabilityModel, AvailabilityExceptionModel, AppointmentModel
│   │   ├── services/                    # سرویس‌های تولید اسلات‌های زمانی و رزرو نوبت با قفل همزمانی
│   │   └── api/                         # Views و Serializers برای لیست نوبت‌ها و ساعات خالی
│   ├── finance/                         # مدیریت تراکنش‌ها، پرداخت زرین‌پال و فاکتورها
│   │   ├── models/                      # TransactionModel, PaymentModel, RefundModel
│   │   ├── services/                    # اتصال به درگاه زرین‌پال (ZarinPal SDK / REST)
│   │   └── api/                         # PaymentInitiate, PaymentCallback, Transactions
│   └── articles/                        # پایگاه دانش، مقالات سلامت، دسته‌بندی و برچسب‌ها
│       ├── models/                      # Article, Category, Tag
│       └── api/                         # CRUD مقالات، فیلترینگ و جستجو
│
├── frontend/                            # رابط کاربری Next.js 15 (App Router)
│   ├── src/
│   │   ├── app/                         # صفحات و لایه‌بندی Next.js
│   │   │   ├── (auth)/                  # صفحات ورود و ثبت‌نام با شماره همراه و کد OTP
│   │   │   ├── (private)/               # صفحات نیازمند لاگین (داشبورد کاربر، رزرو نوبت، پرداخت)
│   │   │   │   ├── user/                # داشبورد کاربر، نوبت‌ها، لیست پزشکان، تایید پرداخت
│   │   │   │   └── admin/               # مدیریت مقالات و دسته‌بندی‌ها
│   │   │   ├── articles/                # لیست و مشاهده جزئیات مقالات سلامت
│   │   │   └── page.tsx                 # صفحه اصلی سامانه با طراحی مدرن و ریسپانسیو
│   │   ├── actions/                     # Server Actions برای برقراری ارتباط با APIهای جنگو
│   │   ├── components/                  # کامپوننت‌های ماژولار UI
│   │   │   ├── clinic/                  # DoctorCard, AppointmentCard, TimeSlotPicker
│   │   │   ├── articles/                # ArticleCard, MarkdownRenderer
│   │   │   └── ui/                      # کامپوننت‌های شبیه shadcn (Button, Dialog, Popover, ...)
│   │   ├── config/                      # متغیرهای محیطی و پیکربندی مرکزی (env.config.ts)
│   │   ├── lib/                         # کلاینت fetcher، هندل خطا و ابزارهای تقویم شمسی
│   │   └── types/                       # تایپ‌های TypeScript همگام با دیتامدل‌های بک‌اند
│
└── .agents/                             # دانش و دستورالعمل‌های ایجنت‌های هوش مصنوعی
    ├── skills/                          # مهارت‌های تخصصی (Django, React, TDD, Shadcn)
    ├── rules/                           # قوانین استایل و امنیت کد
    └── workflows/                       # دستورالعمل‌های اتوماسیون
`

---

## ۲. دیتامدل‌ها و روابط پایگاه داده (Entity Relationship)

`mermaid
erDiagram
    UserModel ||--o| ProfileModel : "has profile"
    UserModel ||--o| DoctorProfileModel : "has doctor profile"
    DoctorProfileModel }o--o{ SpecializationModel : "specializes in"
    DoctorProfileModel ||--o{ RecurringAvailabilityModel : "defines schedule"
    DoctorProfileModel ||--o{ AvailabilityExceptionModel : "defines days off"
    DoctorProfileModel ||--o{ AppointmentModel : "receives appointments"
    UserModel ||--o{ AppointmentModel : "books appointment"
    AppointmentModel ||--o| PaymentModel : "requires payment"
    PaymentModel ||--|| TransactionModel : "records financial state"
    UserModel ||--o{ Article : "authors"
    Article }o--o{ Category : "categorized under"
    Article }o--o{ Tag : "tagged with"
`

---

## ۳. فهرست مسیرهای کلیدی API (API Endpoints v1)

| سرویس | متد | مسیر (Endpoint) | شرح عملکرد | دسترسی |
| :--- | :--- | :--- | :--- | :--- |
| **احراز هویت** | POST | /api/v1/authentication/otp/send/?type=login | ارسال کد تایید به شماره موبایل | عمومی |
| **احراز هویت** | POST | /api/v1/authentication/otp/verify/?type=login | بررسی کد و صدور توکن JWT | عمومی |
| **پزشکان** | GET | /api/v1/accounts/doctors/ | لیست پزشکان تاییدشده با فیلتر تخصص | عمومی |
| **پزشکان** | GET | /api/v1/accounts/doctors/{id}/ | مشاهده اطلاعات کامل و سوابق پزشک | عمومی |
| **اسلات‌های زمانی**| GET | /api/v1/clinic/availability/{doctor_id}/ | دریافت ساعت‌های آزاد پزشک در بازه تاریخی | عمومی |
| **نوبت‌دهی** | POST | /api/v1/clinic/appointments/ | ایجاد رزرو اولیه و دریافت لینک درگاه پرداخت | کاربر لاگین‌شده |
| **نوبت‌دهی** | GET | /api/v1/clinic/appointments/my-appointments/ | لیست نوبت‌های کاربر جاری | کاربر لاگین‌شده |
| **پرداخت** | GET | /api/v1/finance/payment/verify/?Authority=... | بازگشت از زرین‌پال و تایید نهایی نوبت | عمومی |
| **مقالات** | GET | /api/v1/articles/articles/ | لیست مقالات با قابلیت سرچ و فیلتر دسته‌بندی | عمومی |
| **مقالات** | GET | /api/v1/articles/articles/{slug}/ | دریافت کامل محتوای مقاله به همراه کامپوننت | عمومی |

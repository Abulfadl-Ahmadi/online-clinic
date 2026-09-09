# 🏥 Online Clinic Backend

Welcome to **Online Clinic Backend** — a powerful, secure, and scalable backend system built with **Django** for managing an o6. **Run Migrations:**

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

7. **Create a Superuser:**

    ```bash
    python manage.py createsuperuser
    ```

8. **Run the Development Server:**

    For development, you need to run **three** separate terminal windows:

    **Terminal 1 - Django Server:**
    ```bash
    python manage.py runserver
    ```

    **Terminal 2 - Celery Worker:**
    ```bash
    celery -A online_clinic_backend worker -l info
    ```

    **Terminal 3 - Celery Beat (Periodic Tasks):**
    ```bash
    celery -A online_clinic_backend beat -l info
    ```

    Your project should now be running at `http://127.0.0.1:8000/`.

    **Note**: Celery Beat is required for automatic expiration of pending appointments (runs every 5 minutes).
m.

---

## 📌 Features

-   ✅ User management (signup, login, role management)
-   📅 Appointment booking system
-   📁 Medical record management
-   🔒 Secure authentication (JWT / Token Auth)
-   🌐 REST API built with best practices
-   🛠 Modular and extendable project structure

---

## 🛠 Tech Stack

-   **Python** 3.x
-   **Django**
-   **Django REST Framework**
-   **PostgreSQL** (or any preferred database)
-   **Docker** (optional for dev & production)

---

## Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/G-CAT-Devs/online-clinic-backend.git
    cd online-clinic-backend
    ```

2. **Create and Activate a Virtual Environment:**

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate # On Windows use `.venv\Scripts\activate`
    ```

3. **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Set Up Environment Variables:**

    Create a `.env` file in the project root and add the following:

    ```ini
    # ---------------------------------------------------------------
    # Base URL and Admin URL Configuration
    # ---------------------------------------------------------------
    BASE_URL="api/"
    ADMIN_URL="admin/"

    # ---------------------------------------------------------------
    # Debugging and Secret Key Configuration
    # ---------------------------------------------------------------
    DEBUG="True"
    ENABLE_DEBUG_TOOLBAR="True"
    # Replace with your own secret key
    SECRET_KEY="django-insecure-..."

    # ---------------------------------------------------------------
    # Host and Debugging IPs Configuration
    # ---------------------------------------------------------------
    INTERNAL_IPS=localhost,127.0.0.1
    ALLOWED_HOSTS=localhost,127.0.0.1

    CORS_ALLOW_CREDENTIALS=True
    # Replace with your allowed origins (separate with commas)
    CORS_ALLOWED_ORIGINS=""
    # Replace with your allowed origins (separate with commas)
    CSRF_TRUSTED_ORIGINS=""

    # ---------------------------------------------------------------
    # Time Zone and Localization Configuration
    # ---------------------------------------------------------------
    USE_TZ="True"
    USE_I18N="True"
    TIME_ZONE="Asia/Tehran"

    # ---------------------------------------------------------------
    # Static and Media File Configuration
    # ---------------------------------------------------------------
    STATIC_URL=static/
    STATIC_ROOT=static

    MEDIA_URL=/media/
    MEDIA_ROOT=media

    # ---------------------------------------------------------------
    # API Throttling Configuration
    # ---------------------------------------------------------------
    OTP_THROTTLE_RATE="3/minute"
    USER_THROTTLE_RATE="20/minute"
    ANON_THROTTLE_RATE="10/minute"

    # ---------------------------------------------------------------
    # JWT & AUTH Configuration
    # ---------------------------------------------------------------
    # expire after n minutes
    ACCESS_TOKEN_LIFETIME="15"
    # expire after n hours
    REFRESH_TOKEN_LIFETIME="24"
    OTP_LENGTH="6"
    OTP_EXPIRY_MINUTES="5"
    MAX_VERIFY_ATTEMPTS="3"

    # ---------------------------------------------------------------
    # General Configuration
    # ---------------------------------------------------------------
    # in MB
    MAX_AVATAR_SIZE="2"
    SMS_IN_DEV="True"
    SMS_API_KEY="your-api-key"
    VERIFY_SMS_API_URL="https://api.sms.ir/v1/send/verify"

    # ---------------------------------------------------------------
    # Celery Configuration
    # ---------------------------------------------------------------
    CELERY_TIMEZONE="Asia/Tehran"
    CELERY_BROKER_URL="redis://localhost:6379/0"
    CELERY_RESULT_BACKEND="redis://localhost:6379/0"

    # ---------------------------------------------------------------
    # ZarinPal Payment Gateway Configuration
    # ---------------------------------------------------------------
    ZARINPAL_MERCHANT_ID=""  # Your merchant ID from ZarinPal
    ZARINPAL_SANDBOX="True"  # Set to False in production
    ZARINPAL_ACCESS_TOKEN=""  # Optional: For advanced features

    ```

5. **Install Redis (Required for Celery):**

    ```bash
    # Ubuntu/Debian
    sudo apt-get install redis-server
    sudo systemctl start redis
    
    # macOS
    brew install redis
    brew services start redis
    
    # Or using Docker
    docker run -d -p 6379:6379 redis:alpine
    ```

6. **Run Migrations:**

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6. **Create a Superuser:**

    ```bash
    python manage.py createsuperuser
    ```

7. **Run the Development Server:**

    ```bash
    python manage.py runserver
    ```

    Your project should now be running at `http://127.0.0.1:8000/`.

## 🗂 Project Structure

```
online_clinic_backend/
├── .venv/                      # Virtual environment
├── online_clinic_backend/      # Project settings
├── accounts/                   # User management & profiles
├── authentication/             # OTP & JWT authentication
├── clinic/                     # Appointment & availability management
├── finance/                    # Payment processing (ZarinPal)
├── logs/                       # Application logs
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── manage.py                   # Django management script
├── requirements.txt            # Python dependencies
├── PAYMENT_FLOW.md            # Payment flow documentation
└── README.md                   # This file
```

---

## 🔄 Payment Flow

The system uses **ZarinPal** payment gateway for appointment bookings. Here's a quick overview:

1. **Booking Request** → Appointment created with status `PENDING`
2. **Payment Initiation** → User redirected to ZarinPal
3. **Payment Completion** → ZarinPal redirects back with callback
4. **Verification** → Backend verifies payment and updates appointment to `CONFIRMED`
5. **Auto-Expiry** → Unpaid appointments are automatically cancelled after 15 minutes

📖 **For detailed payment flow documentation**, see [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)

---

## 📚 Key Features

### 🔐 Authentication
- OTP-based phone verification
- JWT token authentication
- Role-based access control (Patient, Doctor, Admin)

### 👥 User Management
- User profiles with avatars
- Doctor profiles with specializations
- Settings and preferences

### 📅 Appointment System
- Recurring availability schedules
- Availability exceptions
- Real-time slot checking
- Concurrency-safe booking with database locks
- Automatic conflict prevention

### 💰 Payment Processing
- ZarinPal integration
- Automatic payment verification
- Transaction tracking
- Refund support
- Idempotent payment handling

### ⚙️ Background Tasks
- Automatic expiration of pending appointments
- SMS notifications (via Celery)
- Periodic cleanup tasks

---

## 📜 License

This project is licensed under the **MIT License**.

---

> Made with ❤️ using Django.

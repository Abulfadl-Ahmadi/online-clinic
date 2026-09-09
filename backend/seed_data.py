import os
import django
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "online_clinic_backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import ProfileModel, DoctorProfileModel, SpecializationModel
from accounts.constants import UserRole, UserStatus, UserGender
from clinic.models import RecurringAvailabilityModel
from clinic.constants import DayOfWeek, AppointmentType

User = get_user_model()

def run_seed():
    print("Seeding database with initial users and clinic data...")

    # 1. Specializations
    spec_physio, _ = SpecializationModel.objects.get_or_create(
        name="فیزیوتراپی",
        defaults={"description": "متخصص فیزیوتراپی، توان‌بخشی و درمان اختلالات حرکتی و اسکلتی-عضلانی"}
    )
    # spec_cardio, _ = SpecializationModel.objects.get_or_create(
    #     name="قلب و عروق",
    #     defaults={"description": "متخصص بیماری‌های قلب و عروق و فشار خون"}
    # )
    # spec_internal, _ = SpecializationModel.objects.get_or_create(
    #     name="داخلی",
    #     defaults={"description": "متخصص بیماری‌های داخلی و گوارش"}
    # )
    # spec_derma, _ = SpecializationModel.objects.get_or_create(
    #     name="پوست و مو",
    #     defaults={"description": "متخصص پوست، مو و زیبایی"}
    # )
    # spec_pedia, _ = SpecializationModel.objects.get_or_create(
    #     name="کودکان و اطفال",
    #     defaults={"description": "متخصص بیماری‌های نوزادان و اطفال"}
    # )
    print("✅ Specializations created.")

    # 2. Admin User
    # admin_phone = "09120000001"
    # admin_user, created = User.objects.get_or_create(
    #     phone_number=admin_phone,
    #     defaults={
    #         "role": UserRole.ADMIN,
    #         "status": UserStatus.ACTIVE,
    #         "is_superuser": True,
    #     }
    # )
    # admin_user.set_password("AdminPassword123!")
    # admin_user.role = UserRole.ADMIN
    # admin_user.status = UserStatus.ACTIVE
    # admin_user.is_superuser = True
    # admin_user.save()

    # ProfileModel.objects.update_or_create(
    #     user=admin_user,
    #     defaults={
    #         "first_name": "علیرضا",
    #         "last_name": "حسینی",
    #         "national_code": "0012345678",
    #         "gender": UserGender.MALE,
    #     }
    # )
    # print(f"✅ Admin user created: {admin_phone} (Role: Admin)")

    # 3. Doctor (Dr. Abbas Rahimi - Physiotherapist)
    doc_phone = "09123849349"
    doc_user, _ = User.objects.get_or_create(
        phone_number=doc_phone,
        defaults={
            "role": UserRole.DOCTOR,
            "status": UserStatus.ACTIVE,
        }
    )
    doc_user.set_password("safePass123")
    doc_user.role = UserRole.DOCTOR
    doc_user.status = UserStatus.ACTIVE
    doc_user.save()

    ProfileModel.objects.update_or_create(
        user=doc_user,
        defaults={
            "first_name": "عباس",
            "last_name": "رحیمی",
            "national_code": "0046638751",
            "gender": UserGender.MALE,
        }
    )

    doc_profile, _ = DoctorProfileModel.objects.update_or_create(
        user=doc_user,
        defaults={
            "medical_license_number": "MC-12345",
            "bio": "فیزیوتراپیست و متخصص توان‌بخشی با بیش از ۱۰ سال سابقه در درمان مشکلات عضلانی، اسکلتی و حرکتی",
            "years_of_experience": 10,
            "default_consultation_duration": 30,
            "default_price_irr": Decimal(500000),
            "is_accepting_patients": True,
            "is_verified": True,
        }
    )
    doc_profile.specializations.set([spec_physio])

    # Recurring Availability for Dr. Abbas Rahimi (Saturday to Wednesday)
    for day in [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY]:
        RecurringAvailabilityModel.objects.update_or_create(
            doctor=doc_profile,
            day_of_week=day,
            start_time="09:00:00",
            end_time="17:00:00",
            defaults={
                "price_irr": Decimal(500000),
                "duration_minutes": 30,
                "appointment_type": AppointmentType.CONSULTATION,
                "is_active": True,
            }
        )
    print(f"✅ Doctor created: {doc_phone} - دکتر عباس رحیمی (تخصص: فیزیوتراپی)")

    # 5. Regular Patient / User
    user_phone = "09120000004"
    reg_user, _ = User.objects.get_or_create(
        phone_number=user_phone,
        defaults={
            "role": UserRole.USER,
            "status": UserStatus.ACTIVE,
        }
    )
    reg_user.set_password("UserPassword123!")
    reg_user.role = UserRole.USER
    reg_user.status = UserStatus.ACTIVE
    reg_user.save()

    ProfileModel.objects.update_or_create(
        user=reg_user,
        defaults={
            "first_name": "علی",
            "last_name": "محمدی",
            "national_code": "0012345681",
            "gender": UserGender.MALE,
        }
    )
    print(f"✅ Regular User created: {user_phone} - علی محمدی")

    print("\n🎉 Seed completed successfully!")

if __name__ == "__main__":
    run_seed()

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
    spec_cardio, _ = SpecializationModel.objects.get_or_create(
        name="قلب و عروق",
        defaults={"description": "متخصص بیماری‌های قلب و عروق و فشار خون"}
    )
    spec_internal, _ = SpecializationModel.objects.get_or_create(
        name="داخلی",
        defaults={"description": "متخصص بیماری‌های داخلی و گوارش"}
    )
    spec_derma, _ = SpecializationModel.objects.get_or_create(
        name="پوست و مو",
        defaults={"description": "متخصص پوست، مو و زیبایی"}
    )
    spec_pedia, _ = SpecializationModel.objects.get_or_create(
        name="کودکان و اطفال",
        defaults={"description": "متخصص بیماری‌های نوزادان و اطفال"}
    )
    print("✅ Specializations created.")

    # 2. Admin User
    admin_phone = "09120000001"
    admin_user, created = User.objects.get_or_create(
        phone_number=admin_phone,
        defaults={
            "role": UserRole.ADMIN,
            "status": UserStatus.ACTIVE,
            "is_superuser": True,
        }
    )
    admin_user.set_password("AdminPassword123!")
    admin_user.role = UserRole.ADMIN
    admin_user.status = UserStatus.ACTIVE
    admin_user.is_superuser = True
    admin_user.save()

    ProfileModel.objects.update_or_create(
        user=admin_user,
        defaults={
            "first_name": "علیرضا",
            "last_name": "حسینی",
            "national_code": "0012345678",
            "gender": UserGender.MALE,
        }
    )
    print(f"✅ Admin user created: {admin_phone} (Role: Admin)")

    # 3. Doctor 1 (Dr. Sara Ahmadi - Cardio)
    doc1_phone = "09120000002"
    doc1_user, _ = User.objects.get_or_create(
        phone_number=doc1_phone,
        defaults={
            "role": UserRole.DOCTOR,
            "status": UserStatus.ACTIVE,
        }
    )
    doc1_user.set_password("DoctorPassword123!")
    doc1_user.role = UserRole.DOCTOR
    doc1_user.status = UserStatus.ACTIVE
    doc1_user.save()

    ProfileModel.objects.update_or_create(
        user=doc1_user,
        defaults={
            "first_name": "سارا",
            "last_name": "احمدی",
            "national_code": "0012345679",
            "gender": UserGender.FEMALE,
        }
    )

    doc1_profile, _ = DoctorProfileModel.objects.update_or_create(
        user=doc1_user,
        defaults={
            "medical_license_number": "MC-12345",
            "bio": "متخصص قلب و عروق و فشار خون با ۱۰ سال سابقه در مراکز درمانی برتر",
            "years_of_experience": 10,
            "default_consultation_duration": 30,
            "default_price_irr": Decimal(500000),
            "is_accepting_patients": True,
            "is_verified": True,
        }
    )
    doc1_profile.specializations.set([spec_cardio])

    # Recurring Availability for Doc 1 (Saturday=6, Monday=1, Wednesday=3)
    for day in [DayOfWeek.SATURDAY, DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY]:
        RecurringAvailabilityModel.objects.update_or_create(
            doctor=doc1_profile,
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
    print(f"✅ Doctor 1 created: {doc1_phone} - دکتر سارا احمدی (تخصص: قلب و عروق)")

    # 4. Doctor 2 (Dr. Mehran Rad - Internal)
    doc2_phone = "09120000003"
    doc2_user, _ = User.objects.get_or_create(
        phone_number=doc2_phone,
        defaults={
            "role": UserRole.DOCTOR,
            "status": UserStatus.ACTIVE,
        }
    )
    doc2_user.set_password("DoctorPassword123!")
    doc2_user.role = UserRole.DOCTOR
    doc2_user.status = UserStatus.ACTIVE
    doc2_user.save()

    ProfileModel.objects.update_or_create(
        user=doc2_user,
        defaults={
            "first_name": "مهران",
            "last_name": "راد",
            "national_code": "0012345680",
            "gender": UserGender.MALE,
        }
    )

    doc2_profile, _ = DoctorProfileModel.objects.update_or_create(
        user=doc2_user,
        defaults={
            "medical_license_number": "MC-54321",
            "bio": "فوق تخصص بیماری‌های داخلی، گوارش و غدد",
            "years_of_experience": 8,
            "default_consultation_duration": 30,
            "default_price_irr": Decimal(400000),
            "is_accepting_patients": True,
            "is_verified": True,
        }
    )
    doc2_profile.specializations.set([spec_internal])

    # Recurring Availability for Doc 2 (Sunday=7, Tuesday=2, Thursday=4)
    for day in [DayOfWeek.SUNDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY]:
        RecurringAvailabilityModel.objects.update_or_create(
            doctor=doc2_profile,
            day_of_week=day,
            start_time="10:00:00",
            end_time="18:00:00",
            defaults={
                "price_irr": Decimal(400000),
                "duration_minutes": 30,
                "appointment_type": AppointmentType.CONSULTATION,
                "is_active": True,
            }
        )
    print(f"✅ Doctor 2 created: {doc2_phone} - دکتر مهران راد (تخصص: داخلی)")

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

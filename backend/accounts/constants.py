from django.db import models
from decouple import config

MAX_AVATAR_SIZE = int(str(config("MAX_AVATAR_SIZE", 2, cast=int)))
ALLOWED_EXTENSIONS = "png,jpg,jpeg".split(",")


class UserStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    BANNED = "banned", "Banned"
    DELETED = "deleted", "Deleted"
    INACTIVE = "inactive", "Inactive"


class UserRole(models.TextChoices):
    ADMIN = "admin", "Admin"  # System administrator with full access to all features
    USER = "user", "User"  # General user role (can be deprecated)
    DOCTOR = (
        "doctor",
        "Doctor",
    )  # Medical doctor who can diagnose and prescribe treatments
    PHYSIOTHERAPIST = (
        "physiotherapist",
        "Physiotherapist",
    )  # Licensed physiotherapist providing rehabilitation services
    NURSE = "nurse", "Nurse"  # Registered nurse assisting with patient care
    RECEPTIONIST = (
        "receptionist",
        "Receptionist",
    )  # Front desk staff handling appointments and patient intake
    PATIENT = (
        "patient",
        "Patient",
    )  # Individual receiving medical treatment and services
    MANAGER = "manager", "Manager"  # Clinic manager overseeing operations and staff
    ASSISTANT = (
        "assistant",
        "Assistant",
    )  # Medical assistant supporting healthcare providers
    ACCOUNTANT = (
        "accountant",
        "Accountant",
    )  # Financial staff managing billing and accounting
    LABORATORY_TECHNICIAN = (
        "lab_technician",
        "Laboratory Technician",
    )  # Lab tech performing diagnostic tests
    RADIOLOGIST = (
        "radiologist",
        "Radiologist",
    )  # Specialist interpreting medical imaging
    MEDICAL_IMAGING_TECH = (
        "imaging_tech",
        "Medical Imaging Technician",
    )  # Technician operating imaging equipment
    PHARMACIST = (
        "pharmacist",
        "Pharmacist",
    )  # Licensed pharmacist dispensing medications
    CLEANER = (
        "cleaner",
        "Cleaner",
    )  # Maintenance staff responsible for clinic cleanliness
    SECURITY = "security", "Security"  # Security personnel ensuring clinic safety


class UserGender(models.TextChoices):
    MALE = "male", "Male"
    FEMALE = "female", "Female"
    OTHER = "other", "Other"


class UserTheme(models.TextChoices):
    LIGHT = "light", "Light"
    DARK = "dark", "Dark"
    SYSTEM = "system", "System"


class UserLanguage(models.TextChoices):
    ENGLISH = "en", "English"
    PERSIAN = "fa", "Persian"

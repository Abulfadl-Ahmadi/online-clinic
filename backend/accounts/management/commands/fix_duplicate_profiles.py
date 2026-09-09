"""Management command to fix duplicate profile entries."""

from django.core.management.base import BaseCommand
from django.db.models import Count
from django.db import transaction

from accounts.models import ProfileModel, SettingsModel, DoctorProfileModel


class Command(BaseCommand):
    help = 'Fix duplicate profile and settings entries'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting duplicate cleanup...'))
        
        with transaction.atomic():
            # Fix ProfileModel duplicates
            self.stdout.write('Checking for duplicate ProfileModel entries...')
            profile_duplicates = (
                ProfileModel.objects
                .values('user_id')
                .annotate(count=Count('id'))
                .filter(count__gt=1)
            )
            
            profile_count = 0
            for dup in profile_duplicates:
                profiles = ProfileModel.objects.filter(user_id=dup['user_id']).order_by('created_at')
                # Keep the first one, delete the rest
                profiles_to_delete = profiles[1:]
                count = profiles_to_delete.count()
                profiles_to_delete.delete()
                profile_count += count
                self.stdout.write(
                    self.style.SUCCESS(f'  Deleted {count} duplicate ProfileModel(s) for user_id={dup["user_id"]}')
                )
            
            if profile_count == 0:
                self.stdout.write(self.style.SUCCESS('  No duplicate ProfileModel entries found'))
            else:
                self.stdout.write(self.style.SUCCESS(f'  Total ProfileModel duplicates removed: {profile_count}'))
            
            # Fix SettingsModel duplicates
            self.stdout.write('Checking for duplicate SettingsModel entries...')
            settings_duplicates = (
                SettingsModel.objects
                .values('user_id')
                .annotate(count=Count('id'))
                .filter(count__gt=1)
            )
            
            settings_count = 0
            for dup in settings_duplicates:
                settings = SettingsModel.objects.filter(user_id=dup['user_id']).order_by('created_at')
                # Keep the first one, delete the rest
                settings_to_delete = settings[1:]
                count = settings_to_delete.count()
                settings_to_delete.delete()
                settings_count += count
                self.stdout.write(
                    self.style.SUCCESS(f'  Deleted {count} duplicate SettingsModel(s) for user_id={dup["user_id"]}')
                )
            
            if settings_count == 0:
                self.stdout.write(self.style.SUCCESS('  No duplicate SettingsModel entries found'))
            else:
                self.stdout.write(self.style.SUCCESS(f'  Total SettingsModel duplicates removed: {settings_count}'))
            
            # Fix DoctorProfileModel duplicates
            self.stdout.write('Checking for duplicate DoctorProfileModel entries...')
            doctor_duplicates = (
                DoctorProfileModel.objects
                .values('user_id')
                .annotate(count=Count('id'))
                .filter(count__gt=1)
            )
            
            doctor_count = 0
            for dup in doctor_duplicates:
                doctors = DoctorProfileModel.objects.filter(user_id=dup['user_id']).order_by('created_at')
                # Keep the first one, delete the rest
                doctors_to_delete = doctors[1:]
                count = doctors_to_delete.count()
                doctors_to_delete.delete()
                doctor_count += count
                self.stdout.write(
                    self.style.SUCCESS(f'  Deleted {count} duplicate DoctorProfileModel(s) for user_id={dup["user_id"]}')
                )
            
            if doctor_count == 0:
                self.stdout.write(self.style.SUCCESS('  No duplicate DoctorProfileModel entries found'))
            else:
                self.stdout.write(self.style.SUCCESS(f'  Total DoctorProfileModel duplicates removed: {doctor_count}'))
        
        self.stdout.write(self.style.SUCCESS('\n✓ Cleanup completed successfully!'))
        
        total = profile_count + settings_count + doctor_count
        if total > 0:
            self.stdout.write(
                self.style.SUCCESS(f'Total duplicates removed: {total}')
            )

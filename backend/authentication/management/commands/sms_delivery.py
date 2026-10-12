"""Check handset delivery using a messageId recorded in server logs."""

from django.core.management.base import BaseCommand, CommandError
from authentication.sms_provider import get_delivery_status


class Command(BaseCommand):
    help = "Check sms.ir delivery status using the messageId from OTP server logs"

    def add_arguments(self, parser):
        parser.add_argument("message_id", type=int)

    def handle(self, *args, **options):
        message_id = options["message_id"]
        if message_id <= 0:
            raise CommandError("message_id must be a positive integer")
        delivery = get_delivery_status(message_id)
        if delivery is None:
            raise CommandError("Could not retrieve sms.ir delivery status. Check server logs and API access.")
        self.stdout.write(f"message_id={message_id} delivery={delivery}")

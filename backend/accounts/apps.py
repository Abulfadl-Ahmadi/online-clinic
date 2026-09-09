from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self) -> None:
        super().ready()
        # Import signals so handlers register when the app loads.
        from accounts import signals  # noqa: F401

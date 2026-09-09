from decouple import config
from django.conf import settings
from django.contrib import admin
from rest_framework import routers
from django.urls import include, path
from django.conf.urls.static import static

router = routers.DefaultRouter()

base_url: str = str(config("BASE_URL", default="api/", cast=str))
admin_url: str = str(config("ADMIN_URL", default="admin/", cast=str))


api_v1_patterns = [
    path("", include(router.urls)),
    path("v1/accounts/", include("accounts.api.urls")),
    path("v1/authentication/", include("authentication.api.urls")),
    path("v1/finance/", include("finance.api.urls")),
    path("v1/clinic/", include("clinic.api.urls")),
    path("v1/articles/", include("articles.api.urls")),
]

urlpatterns = [
    path(admin_url, admin.site.urls),
    path(base_url, include(api_v1_patterns)),
]

if getattr(settings, "ENABLE_DEBUG_TOOLBAR", False) and "debug_toolbar" in settings.INSTALLED_APPS:
    urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


admin.site.index_title = "Online Clinic Admin"
admin.site.site_header = "Online Clinic Admin"
admin.site.site_title = "Online Clinic"

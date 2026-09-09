from django.contrib import admin
from ..models import Article, Category, Tag

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "published_at", "author")
    list_filter = ("status", "categories", "tags", "author")
    search_fields = ("title", "summary", "content")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("author", "categories", "tags")
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
import re

__all__ = ["Article", "Category", "Tag"]


def persian_slugify(text):
    """
    Create a slug that supports Persian/Unicode characters.
    Converts text to lowercase, replaces spaces with hyphens,
    and removes special characters while preserving Persian/Arabic letters.
    
    Examples:
        >>> persian_slugify('مقاله درباره سلامت')
        'مقاله-درباره-سلامت'
        >>> persian_slugify('Article About Health')
        'article-about-health'
        >>> persian_slugify('مقاله Python برای مبتدیان')
        'مقاله-python-برای-مبتدیان'
    """
    # Convert to string and strip whitespace
    text = str(text).strip()
    
    # Replace multiple spaces/tabs/newlines with single space
    text = re.sub(r'\s+', ' ', text)
    
    # Replace spaces with hyphens
    text = text.replace(' ', '-')
    
    # Remove special characters but keep:
    # - Persian letters: \u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC
    # - English letters: a-zA-Z
    # - Numbers: 0-9
    # - Hyphens: -
    # Specifically exclude Persian punctuation like ؟ (U+061F) and ، (U+060C)
    text = re.sub(r'[^\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CCa-zA-Z0-9-]', '', text)
    
    # Remove duplicate hyphens
    text = re.sub(r'-+', '-', text)
    
    # Remove leading/trailing hyphens
    text = text.strip('-')
    
    # Convert English letters to lowercase
    text = text.lower()
    
    return text or 'slug'  # Return 'slug' if empty after processing

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Category(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.CharField(max_length=140, unique=True, db_index=True)  # Changed to CharField for Unicode support

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = persian_slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Tag(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.CharField(max_length=140, unique=True, db_index=True)  # Changed to CharField for Unicode support

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = persian_slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ArticleQuerySet(models.QuerySet):
    def published(self):
        now = timezone.now()
        return self.filter(status=Article.Status.PUBLISHED, published_at__lte=now)

class Article(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=220, db_index=True)
    slug = models.CharField(max_length=260, unique=True, db_index=True)  # Changed to CharField for Unicode support
    summary = models.CharField(max_length=1000, blank=True)
    content = models.TextField()
    cover_image = models.URLField(blank=True)  # یا ImageField اگر media دارید
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT, db_index=True)
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="articles")
    categories = models.ManyToManyField(Category, related_name="articles", blank=True)
    tags = models.ManyToManyField(Tag, related_name="articles", blank=True)

    seo_title = models.CharField(max_length=220, blank=True, null=True)
    seo_description = models.CharField(max_length=300, blank=True, null=True)
    reading_time_min = models.PositiveIntegerField(default=0)

    objects = ArticleQuerySet.as_manager()

    class Meta:
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["status", "published_at"]),
            models.Index(fields=["title"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = persian_slugify(self.title)
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def is_published(self):
        return self.status == self.Status.PUBLISHED and (self.published_at or timezone.now()) <= timezone.now()
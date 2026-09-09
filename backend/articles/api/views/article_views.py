from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from articles.models import Article, Category, Tag
from ..serializers import ArticleSerializer, CategorySerializer, TagSerializer

__all__ = ["ArticleViewSet", "CategoryViewSet", "TagViewSet"]

class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class BaseReadOnlyWriteStaffMixin:
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ["published_at", "created_at", "title"]
    search_fields = ["title", "summary", "content"]

class ArticleViewSet(BaseReadOnlyWriteStaffMixin, viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    lookup_field = 'slug'  # Use slug instead of ID for URLs

    def get_queryset(self):
        qs = Article.objects.select_related("author").prefetch_related("categories", "tags")
        user = getattr(self.request, "user", None)
        if user and user.is_staff:
            return qs.all()
        return qs.published()

    filterset_fields = {
        "status": ["exact"],
        "categories__slug": ["exact"],
        "tags__slug": ["exact"],
        "author__id": ["exact"],
    }

class CategoryViewSet(BaseReadOnlyWriteStaffMixin, viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'  # Use slug instead of ID for URLs
    search_fields = ["name"]
    filterset_fields = {"slug": ["exact"]}

class TagViewSet(BaseReadOnlyWriteStaffMixin, viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'  # Use slug instead of ID for URLs
    search_fields = ["name"]
    filterset_fields = {"slug": ["exact"]}

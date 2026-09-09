from rest_framework import serializers
from articles.models import Article, Category, Tag

__all__ = ["CategorySerializer", "TagSerializer", "ArticleSerializer"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]

class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    categories = serializers.SlugRelatedField(slug_field="slug", queryset=Category.objects.all(), many=True, required=False)
    tags = serializers.SlugRelatedField(slug_field="slug", queryset=Tag.objects.all(), many=True, required=False)

    class Meta:
        model = Article
        read_only_fields = ["slug", "created_at", "updated_at"]
        fields = [
            "id", "title", "slug", "summary", "content", "cover_image",
            "status", "published_at", "author", "categories", "tags",
            "seo_title", "seo_description", "reading_time_min",
            "created_at", "updated_at",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            validated_data["author"] = request.user
        return super().create(validated_data)
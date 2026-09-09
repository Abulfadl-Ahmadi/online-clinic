from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import UserModel
from articles.models import Article, Category, Tag


class ArticleAPITests(APITestCase):
	def setUp(self):
		self.staff = UserModel.objects.create_user(
			phone_number="09120000000", password="StrongPass123", role="admin"
		)
		self.category = Category.objects.create(name="General Health")
		self.tag = Tag.objects.create(name="Wellness")

	def test_create_article_as_staff(self):
		self.client.force_authenticate(self.staff)
		url = reverse("article-list")  # DRF router basename
		payload = {
			"title": "First Article",
			"summary": "Short summary",
			"content": "Full content of the article.",
			"status": "published",
			"categories": [self.category.slug],
			"tags": [self.tag.slug],
		}
		resp = self.client.post(url, payload, format="json")
		self.assertEqual(resp.status_code, status.HTTP_201_CREATED, resp.data)
		self.assertTrue(Article.objects.filter(title="First Article").exists())
		art = Article.objects.get(title="First Article")
		self.assertIsNotNone(art.slug)
		self.assertEqual(art.author, self.staff)
		self.assertEqual(art.status, Article.Status.PUBLISHED)
		self.assertIsNotNone(art.published_at)

	def test_list_published_articles_public(self):
		# Create draft and published
		Article.objects.create(title="Draft A", content="...", status="draft")
		Article.objects.create(title="Pub B", content="...", status="published")
		url = reverse("article-list")
		resp = self.client.get(url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		titles = [a["title"] for a in resp.data["results"]] if isinstance(resp.data, dict) and "results" in resp.data else [a["title"] for a in resp.data]
		self.assertIn("Pub B", titles)
		self.assertNotIn("Draft A", titles)

	def test_filter_by_category(self):
		self.client.force_authenticate(self.staff)
		other_cat = Category.objects.create(name="Nutrition")
		article1 = Article.objects.create(title="Cat1", content="...", status="published")
		article1.categories.add(self.category)
		article2 = Article.objects.create(title="Cat2", content="...", status="published")
		article2.categories.add(other_cat)
		url = reverse("article-list") + f"?categories__slug={self.category.slug}"
		resp = self.client.get(url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		titles = [a["title"] for a in resp.data["results"]] if isinstance(resp.data, dict) and "results" in resp.data else [a["title"] for a in resp.data]
		self.assertIn("Cat1", titles)
		self.assertNotIn("Cat2", titles)

	def test_non_staff_cannot_create(self):
		user = UserModel.objects.create_user(
			phone_number="09120000001", password="StrongPass123", role="user"
		)
		self.client.force_authenticate(user)
		url = reverse("article-list")
		payload = {"title": "Nope", "content": "Denied", "status": "draft"}
		resp = self.client.post(url, payload, format="json")
		self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

	def test_slug_auto_generation(self):
		a = Article.objects.create(title="Slug Title", content="...")
		self.assertTrue(a.slug)
		self.assertIn("slug-title", a.slug)

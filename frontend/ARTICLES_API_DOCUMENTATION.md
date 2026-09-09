# 📚 Articles API Documentation

مستندات کامل API مقالات برای تیم Frontend

---

## 📋 فهرست

1. [نمای کلی](#نمای-کلی)
2. [Authentication و Permissions](#authentication-و-permissions)
3. [Articles Endpoints](#articles-endpoints)
4. [Categories Endpoints](#categories-endpoints)
5. [Tags Endpoints](#tags-endpoints)
6. [Filtering و Search](#filtering-و-search)
7. [نمونه‌های کد](#نمونه‌های-کد)

---

## 🎯 نمای کلی

### Base URL
```
http://127.0.0.1:8000/api/v1/articles/
```

### Available Endpoints
- `GET /articles/` - لیست مقالات
- `GET /articles/{slug}/` - جزئیات یک مقاله
- `POST /articles/` - ایجاد مقاله (فقط Admin)
- `PUT/PATCH /articles/{slug}/` - ویرایش مقاله (فقط Admin)
- `DELETE /articles/{slug}/` - حذف مقاله (فقط Admin)
- `GET /categories/` - لیست دسته‌بندی‌ها
- `GET /categories/{slug}/` - جزئیات یک دسته‌بندی
- `GET /tags/` - لیست تگ‌ها
- `GET /tags/{slug}/` - جزئیات یک تگ

---

## 🔐 Authentication و Permissions

### Permissions

| Action | کاربر عادی | کاربر لاگین نشده | Admin |
|--------|------------|------------------|-------|
| لیست مقالات (GET) | ✅ | ✅ | ✅ |
| جزئیات مقاله (GET) | ✅ | ✅ | ✅ |
| ایجاد مقاله (POST) | ❌ | ❌ | ✅ |
| ویرایش مقاله (PUT/PATCH) | ❌ | ❌ | ✅ |
| حذف مقاله (DELETE) | ❌ | ❌ | ✅ |

**نکته مهم**: 
- کاربران عادی و لاگین نشده **فقط مقالات published** را می‌بینند
- Admin ها **همه مقالات** (draft و published) را می‌بینند

### Headers

برای عملیات Admin (ایجاد، ویرایش، حذف):
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

برای خواندن (GET):
```http
Content-Type: application/json
```

---

## 📰 Articles Endpoints

### 1. لیست مقالات

**Request:**
```http
GET /api/v1/articles/articles/
```

**Query Parameters:**
- `page` - شماره صفحه (pagination)
- `status` - فیلتر بر اساس وضعیت (`draft` یا `published`)
- `categories__slug` - فیلتر بر اساس slug دسته‌بندی
- `tags__slug` - فیلتر بر اساس slug تگ
- `author__id` - فیلتر بر اساس ID نویسنده
- `search` - جستجو در title، summary، content
- `ordering` - مرتب‌سازی (`published_at`, `created_at`, `title`, `-published_at`, `-created_at`, `-title`)

**مثال:**
```http
GET /api/v1/articles/articles/?page=1&categories__slug=health&ordering=-published_at
```

**Response:** (200 OK)
```json
{
  "count": 45,
  "next": "http://127.0.0.1:8000/api/v1/articles/articles/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid-here",
      "title": "مقاله درباره سلامت",
      "slug": "article-about-health",
      "summary": "خلاصه مقاله...",
      "content": "محتوای کامل مقاله...",
      "cover_image": "https://example.com/image.jpg",
      "status": "published",
      "published_at": "2025-11-13T10:00:00Z",
      "author": "Dr. John Doe",
      "categories": ["health", "wellness"],
      "tags": ["nutrition", "exercise"],
      "seo_title": "مقاله SEO",
      "seo_description": "توضیحات SEO",
      "reading_time_min": 5,
      "created_at": "2025-11-10T08:00:00Z",
      "updated_at": "2025-11-12T15:30:00Z"
    }
  ]
}
```

---

### 2. جزئیات یک مقاله

**Request:**
```http
GET /api/v1/articles/articles/{slug}/
```

**مثال:**
```http
GET /api/v1/articles/articles/article-about-health/
```

**Response:** (200 OK)
```json
{
  "id": "uuid-here",
  "title": "مقاله درباره سلامت",
  "slug": "article-about-health",
  "summary": "خلاصه مقاله...",
  "content": "محتوای کامل مقاله...",
  "cover_image": "https://example.com/image.jpg",
  "status": "published",
  "published_at": "2025-11-13T10:00:00Z",
  "author": "Dr. John Doe",
  "categories": ["health", "wellness"],
  "tags": ["nutrition", "exercise"],
  "seo_title": "مقاله SEO",
  "seo_description": "توضیحات SEO",
  "reading_time_min": 5,
  "created_at": "2025-11-10T08:00:00Z",
  "updated_at": "2025-11-12T15:30:00Z"
}
```

**Error Response:** (404 Not Found)
```json
{
  "detail": "Not found."
}
```

---

### 3. ایجاد مقاله (فقط Admin)

**Request:**
```http
POST /api/v1/articles/articles/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "عنوان مقاله جدید",
  "summary": "خلاصه مقاله",
  "content": "محتوای کامل مقاله...",
  "cover_image": "https://example.com/new-image.jpg",
  "status": "draft",
  "categories": ["health", "wellness"],
  "tags": ["nutrition"],
  "seo_title": "عنوان SEO",
  "seo_description": "توضیحات SEO",
  "reading_time_min": 7
}
```

**نکات:**
- `slug` خودکار از `title` ساخته می‌شود
- `author` خودکار کاربر فعلی (Admin) ست می‌شود
- `published_at` اگر status = "published" باشد، خودکار زمان فعلی ست می‌شود
- فیلدهای اجباری: `title`, `content`
- فیلدهای اختیاری: بقیه فیلدها

**Response:** (201 Created)
```json
{
  "id": "new-uuid",
  "title": "عنوان مقاله جدید",
  "slug": "new-article-title",
  "summary": "خلاصه مقاله",
  "content": "محتوای کامل مقاله...",
  "cover_image": "https://example.com/new-image.jpg",
  "status": "draft",
  "published_at": null,
  "author": "Admin User",
  "categories": ["health", "wellness"],
  "tags": ["nutrition"],
  "seo_title": "عنوان SEO",
  "seo_description": "توضیحات SEO",
  "reading_time_min": 7,
  "created_at": "2025-11-13T12:00:00Z",
  "updated_at": "2025-11-13T12:00:00Z"
}
```

**Error Response:** (403 Forbidden)
```json
{
  "detail": "You do not have permission to perform this action."
}
```

---

### 4. ویرایش مقاله (فقط Admin)

**Request:**
```http
PATCH /api/v1/articles/articles/{slug}/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:** (فقط فیلدهایی که می‌خواهید تغییر دهید)
```json
{
  "title": "عنوان جدید",
  "status": "published"
}
```

**Response:** (200 OK)
```json
{
  "id": "uuid-here",
  "title": "عنوان جدید",
  "slug": "new-title",
  "status": "published",
  "published_at": "2025-11-13T12:05:00Z",
  ...
}
```

---

### 5. حذف مقاله (فقط Admin)

**Request:**
```http
DELETE /api/v1/articles/articles/{slug}/
Authorization: Bearer {access_token}
```

**Response:** (204 No Content)

---

## 📂 Categories Endpoints

### 1. لیست دسته‌بندی‌ها

**Request:**
```http
GET /api/v1/articles/categories/
```

**Query Parameters:**
- `page` - شماره صفحه
- `slug` - فیلتر بر اساس slug
- `search` - جستجو در name
- `ordering` - مرتب‌سازی (`name`, `-name`, `created_at`, `-created_at`)

**Response:** (200 OK)
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid-1",
      "name": "سلامت",
      "slug": "health"
    },
    {
      "id": "uuid-2",
      "name": "تغذیه",
      "slug": "nutrition"
    }
  ]
}
```

---

### 2. جزئیات یک دسته‌بندی

**Request:**
```http
GET /api/v1/articles/categories/{slug}/
```

**مثال:**
```http
GET /api/v1/articles/categories/health/
```

**Response:** (200 OK)
```json
{
  "id": "uuid-1",
  "name": "سلامت",
  "slug": "health"
}
```

---

### 3. ایجاد دسته‌بندی (فقط Admin)

**Request:**
```http
POST /api/v1/articles/categories/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "دسته‌بندی جدید"
}
```

**نکته:** `slug` خودکار از `name` ساخته می‌شود

**Response:** (201 Created)
```json
{
  "id": "new-uuid",
  "name": "دسته‌بندی جدید",
  "slug": "new-category"
}
```

---

## 🏷️ Tags Endpoints

### 1. لیست تگ‌ها

**Request:**
```http
GET /api/v1/articles/tags/
```

**Query Parameters:**
- `page` - شماره صفحه
- `slug` - فیلتر بر اساس slug
- `search` - جستجو در name
- `ordering` - مرتب‌سازی (`name`, `-name`, `created_at`, `-created_at`)

**Response:** (200 OK)
```json
{
  "count": 25,
  "next": "http://127.0.0.1:8000/api/v1/articles/tags/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid-1",
      "name": "پایتون",
      "slug": "python"
    },
    {
      "id": "uuid-2",
      "name": "جنگو",
      "slug": "django"
    }
  ]
}
```

---

### 2. جزئیات یک تگ

**Request:**
```http
GET /api/v1/articles/tags/{slug}/
```

**مثال:**
```http
GET /api/v1/articles/tags/python/
```

**Response:** (200 OK)
```json
{
  "id": "uuid-1",
  "name": "پایتون",
  "slug": "python"
}
```

---

### 3. ایجاد تگ (فقط Admin)

**Request:**
```http
POST /api/v1/articles/tags/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "تگ جدید"
}
```

**Response:** (201 Created)
```json
{
  "id": "new-uuid",
  "name": "تگ جدید",
  "slug": "new-tag"
}
```

---

## 🔍 Filtering و Search

### 1. جستجو در مقالات

جستجو در `title`, `summary`, `content`:
```http
GET /api/v1/articles/articles/?search=پایتون
```

### 2. فیلتر بر اساس دسته‌بندی

```http
GET /api/v1/articles/articles/?categories__slug=health
```

### 3. فیلتر بر اساس چند تگ

```http
GET /api/v1/articles/articles/?tags__slug=python&tags__slug=django
```

### 4. فیلتر مقالات published

```http
GET /api/v1/articles/articles/?status=published
```

### 5. مرتب‌سازی

جدیدترین مقالات:
```http
GET /api/v1/articles/articles/?ordering=-published_at
```

قدیمی‌ترین مقالات:
```http
GET /api/v1/articles/articles/?ordering=published_at
```

ترکیب چند فیلتر:
```http
GET /api/v1/articles/articles/?categories__slug=health&tags__slug=nutrition&ordering=-published_at&search=ویتامین
```

---

## 💻 نمونه‌های کد

### React/Next.js Example

#### دریافت لیست مقالات

```typescript
// types/article.ts
export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  status: 'draft' | 'published';
  published_at: string | null;
  author: string;
  categories: string[];
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  reading_time_min: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedArticles {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

// services/articleService.ts
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/articles';

export async function getArticles(params?: {
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
  ordering?: string;
}): Promise<PaginatedArticles> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.category) queryParams.append('categories__slug', params.category);
  if (params?.tag) queryParams.append('tags__slug', params.tag);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  
  const response = await fetch(
    `${API_BASE_URL}/articles/?${queryParams.toString()}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  
  return response.json();
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const response = await fetch(`${API_BASE_URL}/articles/${slug}/`);
  
  if (!response.ok) {
    throw new Error('Article not found');
  }
  
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories/`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function getTags() {
  const response = await fetch(`${API_BASE_URL}/tags/`);
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
}
```

#### استفاده در Component

```typescript
// app/articles/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getArticles } from '@/services/articleService';
import type { Article, PaginatedArticles } from '@/types/article';

export default function ArticlesPage() {
  const [data, setData] = useState<PaginatedArticles | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const result = await getArticles({ 
          page, 
          category,
          ordering: '-published_at' 
        });
        setData(result);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchArticles();
  }, [page, category]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!data) return <div>خطا در دریافت مقالات</div>;

  return (
    <div>
      <h1>مقالات</h1>
      
      {/* Article List */}
      <div className="grid grid-cols-3 gap-4">
        {data.results.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button 
          onClick={() => setPage(p => p - 1)} 
          disabled={!data.previous}
        >
          قبلی
        </button>
        <span>صفحه {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={!data.next}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}

// app/articles/[slug]/page.tsx
export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = await getArticleBySlug(params.slug);
  
  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.summary}</p>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
      
      <div>
        <strong>دسته‌بندی‌ها:</strong>
        {article.categories.map(cat => <span key={cat}>{cat}</span>)}
      </div>
      
      <div>
        <strong>تگ‌ها:</strong>
        {article.tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
    </article>
  );
}
```

---

### Vanilla JavaScript Example

```javascript
// دریافت مقالات
async function fetchArticles(page = 1, category = '') {
  const params = new URLSearchParams();
  params.append('page', page);
  if (category) params.append('categories__slug', category);
  
  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/articles/articles/?${params}`
  );
  
  const data = await response.json();
  return data;
}

// دریافت یک مقاله با slug
async function fetchArticle(slug) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/articles/articles/${slug}/`
  );
  
  if (!response.ok) {
    throw new Error('Article not found');
  }
  
  const data = await response.json();
  return data;
}

// نمایش مقالات
async function displayArticles() {
  const data = await fetchArticles(1, 'health');
  
  const container = document.getElementById('articles');
  
  data.results.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.summary}</p>
      <a href="/articles/${article.slug}">ادامه مطلب</a>
    `;
    container.appendChild(articleElement);
  });
}
```

---

## 🚨 نکات مهم برای Frontend

### 1. Slug ها Case-Sensitive هستند
```javascript
// ✅ درست
fetch('/api/v1/articles/articles/my-article-title/')

// ❌ اشتباه (اگر slug با حروف بزرگ باشد)
fetch('/api/v1/articles/articles/My-Article-Title/')
```

### 2. همیشه Trailing Slash اضافه کنید
```javascript
// ✅ درست
fetch('/api/v1/articles/articles/')
fetch('/api/v1/articles/articles/my-slug/')

// ❌ اشتباه
fetch('/api/v1/articles/articles')
fetch('/api/v1/articles/articles/my-slug')
```

### 3. کاربران لاگین نشده فقط مقالات Published را می‌بینند
```javascript
// کاربر عادی فقط مقالات با status="published" را می‌بیند
// Admin همه مقالات را می‌بیند
```

### 4. Pagination همیشه فعال است
```javascript
// همیشه از count, next, previous استفاده کنید
const { count, next, previous, results } = await fetchArticles();
```

### 5. Search در همه فیلدها جستجو می‌کند
```javascript
// جستجو در title, summary, content
fetch('/api/v1/articles/articles/?search=پایتون')
```

---

## 📊 Status Codes

| Code | معنی | زمان رخداد |
|------|------|-----------|
| 200 | OK | درخواست موفق (GET, PUT, PATCH) |
| 201 | Created | ایجاد موفق (POST) |
| 204 | No Content | حذف موفق (DELETE) |
| 400 | Bad Request | داده‌های ارسالی نامعتبر |
| 401 | Unauthorized | نیاز به احراز هویت |
| 403 | Forbidden | عدم دسترسی (نیاز به Admin) |
| 404 | Not Found | مقاله/دسته/تگ یافت نشد |
| 429 | Too Many Requests | تعداد درخواست بیش از حد |
| 500 | Internal Server Error | خطای سرور |

---

## 🔄 Changelog

### نسخه 1.0.0 (2025-11-13)
- استفاده از slug به جای ID در URL ها
- پشتیبانی کامل از filtering و search
- مستندات کامل API

---

## 📞 پشتیبانی

برای سوالات و مشکلات، با تیم Backend تماس بگیرید.

**Backend Team Contact**: [ایمیل یا Slack تیم]

---

> 📝 این مستندات برای تیم Frontend تهیه شده است.
> آخرین بروزرسانی: 13 نوامبر 2025

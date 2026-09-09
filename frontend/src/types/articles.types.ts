/** ================================
 *  Article Domain Types
 *  ================================ */

export const ArticleStatus = {
  draft: "draft",
  published: "published",
} as const;

export type ArticleStatus = keyof typeof ArticleStatus;

export interface Article {
  id: string; // UUID from backend
  title: string;
  slug: string;
  summary: string;
  content: string; // raw HTML or markdown string provided by backend
  coverImage: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  author: string; // Author name as string from backend
  categories: string[]; // array of category slugs
  tags: string[]; // array of tag slugs
  seoTitle: string | null;
  seoDescription: string | null;
  readingTimeMin: number; // Always present from backend
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string; // UUID from backend
  name: string;
  slug: string;
}

export interface Tag {
  id: string; // UUID from backend
  name: string;
  slug: string;
}

/** ================================
 *  List Responses (Paginated)
 *  ================================ */
export interface ArticlesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

export interface CategoriesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface TagsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

/** ================================
 *  Query Param Helpers
 *  ================================ */
export interface ArticlesQueryParams {
  page?: number;
  search?: string;
  ordering?: "publishedAt" | "createdAt" | "title" | `-${string}` | string; // backend handles validation
  status?: ArticleStatus;
  categoriesSlug?: string; // maps to categories__slug
  tagsSlug?: string; // maps to tags__slug
  authorId?: string; // UUID of author
}

export interface CreateArticleRequest {
  title: string;
  summary?: string; // Optional based on backend docs
  content: string;
  coverImage?: string | null;
  status?: ArticleStatus; // Optional, defaults to draft
  publishedAt?: string | null; // Auto-set by backend if status=published
  categories?: string[]; // slugs - Optional
  tags?: string[]; // slugs - Optional
  seoTitle?: string | null;
  seoDescription?: string | null;
  readingTimeMin?: number; // Optional
}

export type UpdateArticleRequest = Partial<CreateArticleRequest>;

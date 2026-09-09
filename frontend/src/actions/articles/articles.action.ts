"use server";

import { apiFetch } from "@/lib/api";
import { buildArticlesQuery, ARTICLES_BASE } from "@/lib/utils/articles-query";
import { getSession } from "@/actions/token";
import {
  ApiResult,
  Article,
  ArticlesListResponse,
  ArticlesQueryParams,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "@/types";
import { keysToSnake } from "@/lib/utils/case-converter";

/** Base path handled via util import */

/**
 * Build query string for listing articles with filters/search/ordering.
 */
// Moved to a pure util module to avoid non-async export within a "use server" file.
// See `lib/utils/articles-query.ts` for implementation.

/** ================================
 *  List Articles (public; staff gets drafts if token provided)
 *  ================================ */
export async function listArticles(
  params: ArticlesQueryParams = {}
): Promise<ApiResult<ArticlesListResponse>> {
  const { accessToken } = await getSession();
  const url = buildArticlesQuery({ page: params.page ?? 1, ...params });

  return apiFetch<ArticlesListResponse>(url, {
    method: "GET",
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });
}

/** ================================
 *  Get Article Detail (by slug)
 *  ================================ */
export async function getArticleDetail(slug: string): Promise<ApiResult<Article>> {
  const { accessToken } = await getSession();
  const url = `${ARTICLES_BASE}${slug}/`;

  return apiFetch<Article>(url, {
    method: "GET",
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });
}

/** ================================
 *  Create Article (staff only)
 *  ================================ */
export async function createArticle(
  data: CreateArticleRequest
): Promise<ApiResult<Article>> {
  const { accessToken } = await getSession();

  if (!accessToken) {
    return {
      success: false,
      message: "برای ایجاد مقاله باید وارد شوید",
      statusCode: 401,
      type: "Unauthorized",
    };
  }

  // Backend expects snake_case keys for fields with underscores
  const payload = keysToSnake({
    ...data,
    coverImage: data.coverImage ?? null,
    publishedAt: data.publishedAt ?? null,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  });

  return apiFetch<Article>(ARTICLES_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

/** ================================
 *  Update Article (partial via PATCH) staff only
 *  ================================ */
export async function updateArticle(
  slug: string,
  patch: UpdateArticleRequest
): Promise<ApiResult<Article>> {
  const { accessToken } = await getSession();

  if (!accessToken) {
    return {
      success: false,
      message: "برای ویرایش مقاله باید وارد شوید",
      statusCode: 401,
      type: "Unauthorized",
    };
  }

  const payload = keysToSnake(patch);
  const url = `${ARTICLES_BASE}${slug}/`;

  return apiFetch<Article>(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

/** ================================
 *  Delete Article (staff only)
 *  ================================ */
export async function deleteArticle(slug: string): Promise<ApiResult<null>> {
  const { accessToken } = await getSession();

  if (!accessToken) {
    return {
      success: false,
      message: "برای حذف مقاله باید وارد شوید",
      statusCode: 401,
      type: "Unauthorized",
    };
  }

  const url = `${ARTICLES_BASE}${slug}/`;

  return apiFetch<null>(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

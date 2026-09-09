import { ArticlesQueryParams } from '@/types';

const ARTICLES_BASE = '/articles/articles/';

export function buildArticlesQuery(params: ArticlesQueryParams = {}): string {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.search) searchParams.set('search', params.search);
  if (params.ordering) searchParams.set('ordering', params.ordering);
  if (params.status) searchParams.set('status', params.status);
  if (params.categoriesSlug) searchParams.set('categories__slug', params.categoriesSlug);
  if (params.tagsSlug) searchParams.set('tags__slug', params.tagsSlug);
  if (params.authorId) searchParams.set('author__id', params.authorId);
  const qs = searchParams.toString();
  return qs ? `${ARTICLES_BASE}?${qs}` : ARTICLES_BASE;
}

export { ARTICLES_BASE };
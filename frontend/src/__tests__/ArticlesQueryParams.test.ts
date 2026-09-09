import { buildArticlesQuery } from '@/lib/utils/articles-query';
import { describe, it, expect } from 'vitest';

describe('buildArticlesQuery integration shape', () => {
  it('maps filters correctly', () => {
    const qs = buildArticlesQuery({
      search: 'سلام',
      ordering: '-created_at',
      page: 2,
      categoriesSlug: 'nutrition',
      tagsSlug: 'health',
    });
    expect(qs).toContain('search=%D8%B3%D9%84%D8%A7%D9%85');
    expect(qs).toContain('ordering=-created_at');
    expect(qs).toContain('page=2');
    expect(qs).toContain('categories__slug=nutrition');
    expect(qs).toContain('tags__slug=health');
  });
});

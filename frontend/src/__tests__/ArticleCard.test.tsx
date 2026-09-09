import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article } from '@/types/articles.types';

function makeArticle(partial: Partial<Article> = {}): Article {
  return {
    id: 'art-1',
    slug: 'test-article',
    title: 'عنوان تستی',
    summary: 'خلاصه تستی',
    content: '<p>متن تستی</p>',
    coverImage: null,
    readingTimeMin: 4,
    status: 'published',
    publishedAt: new Date().toISOString(),
    author: 'علی کاظمی',
    categories: [],
    tags: [],
    seoTitle: null,
    seoDescription: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...partial,
  };
}

describe('ArticleCard', () => {
  it('renders title and summary', () => {
    render(<ArticleCard article={makeArticle()} />);
    expect(screen.getByText('عنوان تستی')).toBeInTheDocument();
    expect(screen.getByText('خلاصه تستی')).toBeInTheDocument();
  });

  it('shows reading time minutes', () => {
    render(<ArticleCard article={makeArticle({ readingTimeMin: 7 })} />);
    expect(screen.getByText(/7 دقیقه/)).toBeInTheDocument();
  });
});

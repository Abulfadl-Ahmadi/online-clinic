"use client";

import ArticleCard from "./ArticleCard";
import EmptyState from "./EmptyState";
import { Article } from "@/types";

interface ArticleListProps {
  articles: Article[];
  showEditButton?: boolean;
  categoryNames?: Record<string, string>;
  tagNames?: Record<string, string>;
}

export default function ArticleList({
  articles,
  showEditButton = false,
  categoryNames,
  tagNames,
}: ArticleListProps) {
  if (!articles.length) {
    return <EmptyState title="مقاله‌ای یافت نشد" description="عبارت جستجو یا فیلترها را تغییر دهید." />;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard
          key={a.id}
          article={a}
          showEditButton={showEditButton}
          categoryNames={categoryNames}
          tagNames={tagNames}
        />
      ))}
    </div>
  );
}

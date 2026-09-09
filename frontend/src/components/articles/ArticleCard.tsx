"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Article } from "@/types";
import { ArrowLeft, Edit } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import TagChip from "./TagChip";

interface ArticleCardProps {
  article: Article;
  showEditButton?: boolean;
  /** slug -> Persian name lookup for categories */
  categoryNames?: Record<string, string>;
  /** slug -> Persian name lookup for tags */
  tagNames?: Record<string, string>;
}

export default function ArticleCard({
  article,
  showEditButton = false,
  categoryNames,
  tagNames,
}: ArticleCardProps) {
  return (
    <Card className={cn("overflow-hidden", article.coverImage && "pt-0")}>
      {article.coverImage ? (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : null}

      <CardHeader className="gap-2">
        <CardTitle className="text-lg">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </CardTitle>
        {article.summary ? (
          <CardDescription className="line-clamp-2">
            {article.summary}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {article.publishedAt ? (
            <span>{new Date(article.publishedAt).toLocaleDateString("fa-IR")}</span>
          ) : null}
          {typeof article.readingTimeMin === "number" ? (
            <span>• {article.readingTimeMin} دقیقه مطالعه</span>
          ) : null}
          <div className="ms-auto flex flex-wrap gap-1">
            {article.categories?.slice(0, 2).map((c) => (
              <CategoryBadge key={c} slug={c} name={categoryNames?.[c]} />
            ))}
            {article.tags?.slice(0, 2).map((t) => (
              <TagChip key={t} tag={t} name={tagNames?.[t]} />
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/articles/${article.slug}`}>
              مشاهده مقاله
              <ArrowLeft className="size-4 me-2" />
            </Link>
          </Button>
          {showEditButton && (
            <Button asChild variant="secondary" className="flex-1">
              <Link href={`/admin/articles/${article.slug}`}>
                ویرایش
                <Edit className="size-4 me-2" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

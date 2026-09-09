import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleDetail, listCategories, listTags } from "@/actions";
import ArticleContent from "@/components/articles/ArticleContent";
import ArticleSummary from "@/components/articles/ArticleSummary";
import CategoryBadge from "@/components/articles/CategoryBadge";
import TagChip from "@/components/articles/TagChip";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const res = await getArticleDetail(params.slug);
  if (!res.success) return {};
  const a = res.data;
  return {
    title: a.seoTitle || a.title,
    description: a.seoDescription || a.summary || undefined,
    openGraph: {
      title: a.seoTitle || a.title,
      description: a.seoDescription || a.summary || undefined,
      images: a.coverImage ? [a.coverImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage(props: PageProps) {
  const params = await props.params;
  const res = await getArticleDetail(params.slug);
  if (!res.success) return notFound();
  const a = res.data;

  const [catRes, tagRes] = await Promise.all([
    listCategories({ page: 1, ordering: "name" }),
    listTags({ page: 1, ordering: "name" }),
  ]);
  const categoryNames = catRes.success
    ? Object.fromEntries(catRes.data.results.map((c) => [c.slug, c.name]))
    : undefined;
  const tagNames = tagRes.success
    ? Object.fromEntries(tagRes.data.results.map((t) => [t.slug, t.name]))
    : undefined;

  return (
    <article className="mx-auto max-w-3xl flex flex-col gap-6" dir="rtl">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">{a.title}</h1>
        {a.summary && <ArticleSummary summary={a.summary} />}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {a.publishedAt ? <span>{new Date(a.publishedAt).toLocaleDateString("fa-IR")}</span> : null}
          {typeof a.readingTimeMin === "number" ? (
            <span>• {a.readingTimeMin} دقیقه مطالعه</span>
          ) : null}
          <div className="ms-auto flex flex-wrap gap-1">
            {a.categories?.map((c) => (
              <CategoryBadge key={c} slug={c} name={categoryNames?.[c]} />
            ))}
            {a.tags?.map((t) => (
              <TagChip key={t} tag={t} name={tagNames?.[t]} />
            ))}
          </div>
        </div>
      </header>

      <ArticleContent content={a.content} />
    </article>
  );
}

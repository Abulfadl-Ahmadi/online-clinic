import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
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
  if (!res.success) {
    if (res.statusCode === 404) return notFound();
    return (
      <section className="brand-page min-h-[60vh] px-4 py-20" dir="rtl">
        <div className="brand-card mx-auto max-w-3xl rounded-[1.5rem] p-8 text-center">
          <h1 className="text-2xl font-extrabold text-[var(--brand-ink)]">مقاله فعلاً در دسترس نیست</h1>
          <p className="mt-4 leading-8 text-[var(--brand-muted)]">لطفاً کمی بعد دوباره تلاش کنید یا از فهرست مقاله‌ها دیدن کنید.</p>
          <Link href="/articles" className="brand-link-ring mt-6 inline-flex min-h-11 items-center font-bold text-[var(--brand-ink)] underline-offset-4 hover:underline">بازگشت به مقاله‌ها</Link>
        </div>
      </section>
    );
  }
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
    <article className="brand-page min-h-screen" dir="rtl">
      <header className="brand-motion-field px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <Link href="/articles" className="brand-link-ring inline-flex items-center gap-2 text-sm font-bold text-[#123e46] hover:text-[#74364b]">
            <ArrowLeft className="size-4" /> بازگشت به مقاله‌ها
          </Link>
          <div className="mt-8 rounded-[1.5rem] border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-10">
            <div className="flex flex-wrap gap-1">
              {a.categories?.map((c) => <CategoryBadge key={c} slug={c} name={categoryNames?.[c]} />)}
              {a.tags?.map((t) => <TagChip key={t} tag={t} name={tagNames?.[t]} />)}
            </div>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-[#123e46] sm:text-5xl">{a.title}</h1>
            {a.summary && <div className="mt-5 max-w-3xl text-lg leading-8 text-[#415357]"><ArticleSummary summary={a.summary} /></div>}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#596a6d]">
              {a.publishedAt ? <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-[#4b8a83]" />{new Date(a.publishedAt).toLocaleDateString("fa-IR")}</span> : null}
              {typeof a.readingTimeMin === "number" ? <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-[#4b8a83]" />{a.readingTimeMin} دقیقه مطالعه</span> : null}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-[1.5rem] border border-[#123e46]/10 bg-white p-6 shadow-sm sm:p-10">
          <ArticleContent content={a.content} />
        </div>
        <aside className="mx-auto mt-10 max-w-3xl rounded-[1.5rem] bg-[#edf5f3] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div><p className="font-extrabold text-[#123e46]">برای ارزیابی و برنامهٔ درمان شخصی</p><p className="mt-2 leading-7 text-[#596a6d]">برای هماهنگی نوبت یا طرح پرسش خود با کلینیک تماس بگیرید.</p></div>
          <Link href="/auth/login" className="brand-link-ring mt-5 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#123e46] px-5 font-bold text-white hover:bg-[#0d3239] sm:mt-0"><CalendarDays className="size-5" />درخواست نوبت</Link>
        </aside>
      </div>
    </article>
  );
}

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText } from "lucide-react";
import { listArticles } from "@/actions";
import { articlePageNumber } from "@/lib/utils/article-page-number";

export const metadata = { title: "Articles", alternates: { languages: { fa: "/articles", en: "/en/articles" } } };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{ page?: string | string[] }>;
}

export default async function EnglishArticlesPage({ searchParams }: PageProps) {
  const page = articlePageNumber((await searchParams)?.page);
  const response = await listArticles({ page, ordering: "-published_at" });
  return <>
    <section className="brand-motion-field px-4 py-16 sm:py-20"><div className="mx-auto max-w-7xl"><p className="brand-overline flex items-center gap-2"><BookOpenText aria-hidden="true" className="size-4" />CLINIC LIBRARY</p><h1 className="mt-4 text-4xl font-extrabold text-[var(--brand-ink)] sm:text-5xl">Articles & patient resources</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-copy)]">Explore the clinic’s writing about rehabilitation and movement. The original articles are in Persian; English clinical translations are not yet available.</p></div></section>
    <section className="px-4 py-16"><div className="mx-auto max-w-7xl"><div className="mb-7 flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-extrabold text-[var(--brand-ink)]">From the clinic</h2><Link href="/articles" hrefLang="fa" className="brand-link-ring inline-flex min-h-11 items-center gap-2 font-bold text-[var(--brand-ink)] hover:text-[var(--brand-wine)]">Browse the full Persian archive <ArrowRight aria-hidden="true" className="size-4" /></Link></div>
      {response.success && response.data.results.length > 0 ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{response.data.results.map((article) => <article key={article.id} className="brand-card flex h-full flex-col rounded-2xl p-6"><p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)]">Persian article</p><h3 lang="fa" dir="rtl" className="mt-4 text-xl font-extrabold leading-relaxed text-[var(--brand-ink)]">{article.title}</h3>{article.summary && <p lang="fa" dir="rtl" className="mt-3 line-clamp-3 leading-8 text-[var(--brand-muted)]">{article.summary}</p>}<Link href={`/articles/${article.slug}`} hrefLang="fa" aria-label={`Read ${article.title} in Persian`} className="brand-link-ring mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-bold text-[var(--brand-ink)] hover:text-[var(--brand-wine)]">Read in Persian <ArrowRight aria-hidden="true" className="size-4" /></Link></article>)}</div> : <div className="brand-card rounded-2xl p-8 text-[var(--brand-muted)]"><p>{response.success ? (page > 1 ? "No articles on this page. Go back to the previous page or start from page one." : "No articles have been published yet. Please check back soon.") : "The article archive is temporarily unavailable. Please try again later."}</p>{response.success && page > 1 && response.data.results.length === 0 && <Link href="/en/articles" className="brand-link-ring mt-5 inline-flex min-h-11 items-center font-bold text-[var(--brand-ink)] underline-offset-4 hover:underline">Start from page one</Link>}</div>}
      {response.success && (page > 1 || Boolean(response.data.next)) && <nav aria-label="Article pages" className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-[var(--brand-ink)]">
        {page > 1 && <Link href={`/en/articles?page=${page - 1}`} rel="prev" className="brand-link-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--brand-line)] px-4"><ArrowLeft aria-hidden="true" className="size-4" />Previous</Link>}
        <span aria-current="page">Page {page}</span>
        {response.data.next && page < 999999 && <Link href={`/en/articles?page=${page + 1}`} rel="next" className="brand-link-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--brand-line)] px-4">Next<ArrowRight aria-hidden="true" className="size-4" /></Link>}
      </nav>}
    </div></section>
  </>;
}

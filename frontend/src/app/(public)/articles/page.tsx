import { listArticles, listCategories, listTags } from "@/actions";
import ArticleList from "@/components/articles/ArticleList";
import ArticlesFilters from "@/components/articles/ArticlesFilters";
import PaginationControls from "@/components/articles/PaginationControls";
import { BookOpenText, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";

interface PageProps {
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

async function applyFilters(formData: FormData) {
	"use server";
	const params = new URLSearchParams({ page: "1" });
	const search = formData.get("search")?.toString();
	const ordering = formData.get("ordering")?.toString();
	const category = formData.get("category")?.toString();
	const tag = formData.get("tag")?.toString();
	
	if (search) params.set("search", search);
	if (ordering) params.set("ordering", ordering);
	if (category) params.set("categories__slug", category);
	if (tag) params.set("tags__slug", tag);
	
	redirect(`/articles?${params.toString()}`);
}

async function ArticlePage(props: PageProps) {
	const searchParams = await props.searchParams;
	const page = Number((searchParams?.page as string) || 1) || 1;
	const search = (searchParams?.search as string) || undefined;
	const ordering = (searchParams?.ordering as string) || "-published_at";
	const categoriesSlug = (searchParams?.["categories__slug"] as string) || undefined;
	const tagsSlug = (searchParams?.["tags__slug"] as string) || undefined;

	const [res, cats, tags] = await Promise.all([
		listArticles({ page, search, ordering, categoriesSlug, tagsSlug }),
		listCategories({ page: 1, ordering: "name" }),
		listTags({ page: 1, ordering: "name" }),
	]);

	if (!res.success) {
		return (
			<div className="brand-page min-h-[60vh] px-4 py-16" dir="rtl">
				<div className="mx-auto max-w-7xl rounded-[1.5rem] border border-[#74364b]/15 bg-[#fffafa] p-8 text-center shadow-sm">
					<h1 className="text-xl font-extrabold text-[#123e46]">مقالات فعلاً در دسترس نیستند</h1>
					<p className="mt-3 leading-8 text-[#596a6d]">لطفاً چند دقیقهٔ دیگر دوباره تلاش کنید یا برای راهنمایی با کلینیک تماس بگیرید.</p>
				</div>
			</div>
		);
	}

	const { results, next, previous } = res.data;

	const categoryNames = cats.success
		? Object.fromEntries(cats.data.results.map((c) => [c.slug, c.name]))
		: undefined;
	const tagNames = tags.success
		? Object.fromEntries(tags.data.results.map((t) => [t.slug, t.name]))
		: undefined;

	return (
		<div className="brand-page min-h-screen" dir="rtl">
			<section className="public-intro relative isolate overflow-hidden px-4 py-16 sm:py-20">
				<div className="public-intro-pattern pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
				<div className="mx-auto max-w-7xl">
					<Reveal className="max-w-3xl">
						<p className="brand-overline flex items-center gap-2"><BookOpenText className="size-4" />دانشنامهٔ کلینیک</p>
						<h1 className="mt-4 text-4xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-5xl">دانش قابل‌فهم برای حرکت آگاهانه‌تر</h1>
						<p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-copy)]">مقاله‌ها و راهنماهای آموزشی کلینیک دربارهٔ توان‌بخشی، پیشگیری از آسیب و مراقبت از حرکت.</p>
					</Reveal>
				</div>
			</section>

			<section className="px-4 py-12 sm:py-16">
				<div className="mx-auto max-w-7xl">
					<Reveal className="rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-5 sm:p-7">
						<div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-[var(--brand-soft)] p-2 text-[var(--brand-ink)]"><Search className="size-5" /></div><div><h2 className="font-extrabold text-[#123e46]">جست‌وجو در مقاله‌ها</h2><p className="mt-1 text-sm text-[#596a6d]">بر اساس موضوع، دسته‌بندی یا برچسب موردنظر خود فیلتر کنید.</p></div></div>
						<ArticlesFilters
							defaultSearch={search}
							defaultOrdering={ordering}
							defaultCategory={categoriesSlug}
							defaultTag={tagsSlug}
							categories={cats.success ? cats.data.results.map(c => ({ label: c.name, value: c.slug })) : []}
							tags={tags.success ? tags.data.results.map(t => ({ label: t.name, value: t.slug })) : []}
							action={applyFilters}
						/>
					</Reveal>

					<Reveal className="mt-12">
						<div className="mb-6 flex items-end justify-between gap-4"><div><p className="brand-overline">مطالب آموزشی</p><h2 className="mt-2 text-2xl font-extrabold text-[#123e46] sm:text-3xl">مقاله‌های تازه</h2></div><p className="text-sm text-[#596a6d]">{results.length.toLocaleString("fa-IR")} مقاله در این صفحه</p></div>
						<ArticleList articles={results} categoryNames={categoryNames} tagNames={tagNames} />
						<div className="mt-10"><PaginationControls page={page} hasNext={Boolean(next)} hasPrevious={Boolean(previous)} /></div>
					</Reveal>
				</div>
			</section>
		</div>
	);
}

export default ArticlePage;

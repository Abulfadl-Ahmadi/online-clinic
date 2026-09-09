import { listArticles } from "@/actions";
import ArticleList from "@/components/articles/ArticleList";
import ArticlesFilters from "@/components/articles/ArticlesFilters";
import PaginationControls from "@/components/articles/PaginationControls";
import { redirect } from "next/navigation";
import { listCategories, listTags } from "@/actions";

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
		// For the public list, on hard error go to not-found or show a simple message
		return (
			<div className="text-sm text-destructive p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
				خطا در بارگذاری لیست مقالات
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
		<div className="space-y-6">
			<ArticlesFilters
				defaultSearch={search}
				defaultOrdering={ordering}
				defaultCategory={categoriesSlug}
				defaultTag={tagsSlug}
				categories={cats.success ? cats.data.results.map(c => ({ label: c.name, value: c.slug })) : []}
				tags={tags.success ? tags.data.results.map(t => ({ label: t.name, value: t.slug })) : []}
				action={applyFilters}
			/>

			<ArticleList articles={results} categoryNames={categoryNames} tagNames={tagNames} />

			<PaginationControls
				page={page}
				hasNext={Boolean(next)}
				hasPrevious={Boolean(previous)}
			/>
		</div>
	);
}

export default ArticlePage;

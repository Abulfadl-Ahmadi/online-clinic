import Link from "next/link";
import { listArticles } from "@/actions";
import ArticleList from "@/components/articles/ArticleList";
import { Button } from "@/components/ui/button";

export default async function AdminArticlesPage() {
  const res = await listArticles({ page: 1, ordering: "-created_at" });
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت مقالات</h1>
        <Button asChild>
          <Link href="/admin/articles/new">مقاله جدید</Link>
        </Button>
      </div>
      {res.success ? (
        <ArticleList articles={res.data.results} showEditButton />
      ) : (
        <div className="text-sm text-destructive p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
          خطا در بارگذاری مقالات
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { listArticles } from "@/actions";
import ArticleList from "@/components/articles/ArticleList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  const requestedPage = Number((await searchParams).page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const res = await listArticles({ page, ordering: "-created_at" });
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت مقالات</h1>
        <Button asChild>
          <Link href="/admin/articles/new">مقاله جدید</Link>
        </Button>
      </div>
      {res.success ? (
        <>
          <ArticleList articles={res.data.results} showEditButton />
          {(res.data.previous || res.data.next) && <nav aria-label="صفحه‌بندی مقالات مدیریت" className="flex items-center justify-center gap-4">
            {res.data.previous ? <Button variant="outline" asChild><Link href={`/admin/articles?page=${page - 1}`} aria-label="صفحه قبل"><ChevronRight aria-hidden="true" /></Link></Button> : <Button variant="outline" disabled aria-label="صفحه قبل"><ChevronRight aria-hidden="true" /></Button>}
            <span className="text-sm text-muted-foreground">صفحه {page} · مجموع {res.data.count} مقاله</span>
            {res.data.next ? <Button variant="outline" asChild><Link href={`/admin/articles?page=${page + 1}`} aria-label="صفحه بعد"><ChevronLeft aria-hidden="true" /></Link></Button> : <Button variant="outline" disabled aria-label="صفحه بعد"><ChevronLeft aria-hidden="true" /></Button>}
          </nav>}
        </>
      ) : (
        <div className="text-sm text-destructive p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
          خطا در بارگذاری مقالات
        </div>
      )}
    </div>
  );
}

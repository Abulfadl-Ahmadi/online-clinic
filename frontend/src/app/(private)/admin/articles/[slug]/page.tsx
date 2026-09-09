"use server";

import requireAuth from "@/actions/auth/requireAuth.action";
import { getArticleDetail, listCategories, listTags, updateArticle, deleteArticle } from "@/actions";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { DeleteArticleButton } from "@/components/articles/DeleteArticleButton";

interface PageProps { params: Promise<{ slug: string }> }

export default async function AdminEditArticlePage(props: PageProps) {
  await requireAuth({ requiredRoles: ["admin"], redirectPath: "/auth/login" });
  const params = await props.params;
  const [art, cats, tags] = await Promise.all([
    getArticleDetail(params.slug),
    listCategories({ page: 1, ordering: "name" }),
    listTags({ page: 1, ordering: "name" }),
  ]);

  if (!art.success) return notFound();

  async function submit(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const summary = String(formData.get("summary") || "");
    const content = String(formData.get("content") || "");
    const coverImage = String(formData.get("coverImage") || "");
    const status = String(formData.get("status") || "draft") as "draft" | "published";
    const categories = (formData.getAll("categories") as string[]) || [];
    const tags = (formData.getAll("tags") as string[]) || [];
    const seoTitle = String(formData.get("seoTitle") || "");
    const seoDescription = String(formData.get("seoDescription") || "");

    const res = await updateArticle(params.slug, {
      title,
      summary: summary || undefined,
      content,
      coverImage: coverImage || null,
      status,
      categories: categories.length > 0 ? categories : undefined,
      tags: tags.length > 0 ? tags : undefined,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    });

    if (res.success) {
      revalidatePath("/articles");
      revalidatePath(`/articles/${res.data.slug}`);
      revalidatePath("/admin/articles");
      redirect(`/articles/${res.data.slug}?updated=true`);
    } else {
      redirect(`/admin/articles/${params.slug}?error=${encodeURIComponent(res.message || "خطا در ویرایش مقاله")}`);
    }
  }

  async function remove() {
    "use server";
    const r = await deleteArticle(params.slug);
    if (r.success) {
      revalidatePath("/articles");
      revalidatePath("/admin/articles");
      redirect("/admin/articles?deleted=true");
    } else {
      redirect(`/admin/articles/${params.slug}?error=${encodeURIComponent(r.message || "خطا در حذف مقاله")}`);
    }
  }

  const a = art.data;
  const categoryOptions = cats.success ? cats.data.results : [];
  const tagOptions = tags.success ? tags.data.results : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">ویرایش مقاله</h1>
        <div className="flex gap-2 items-center">
          <Link 
            href="/admin/articles/categories" 
            className="text-xs text-muted-foreground hover:underline"
          >
            دسته‌بندی‌ها
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link 
            href="/admin/articles/tags" 
            className="text-xs text-muted-foreground hover:underline"
          >
            تگ‌ها
          </Link>
          <span className="text-muted-foreground">•</span>
          <form action={remove} className="inline">
            <DeleteArticleButton onDelete={() => {}} />
          </form>
        </div>
      </div>
      <form action={submit} className="flex flex-col gap-4" dir="rtl">
        <div>
          <label htmlFor="title" className="mb-1 block text-xs font-medium">عنوان</label>
          <input id="title" name="title" defaultValue={a.title} placeholder="عنوان مقاله" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label htmlFor="summary" className="mb-1 block text-xs font-medium">خلاصه</label>
          <textarea id="summary" name="summary" defaultValue={a.summary} rows={3} placeholder="خلاصه کوتاه" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label htmlFor="content" className="mb-1 block text-xs font-medium">متن مقاله</label>
          <textarea id="content" name="content" defaultValue={a.content} rows={10} placeholder="متن کامل مقاله" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label htmlFor="coverImage" className="mb-1 block text-xs font-medium">تصویر کاور (URL)</label>
          <input id="coverImage" name="coverImage" defaultValue={a.coverImage ?? ''} placeholder="https://..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-xs font-medium">وضعیت</label>
          <select id="status" name="status" aria-label="وضعیت" className="rounded-md border border-border bg-background px-3 py-2 text-sm" defaultValue={a.status}>
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشر شده</option>
          </select>
        </div>
        <div>
          <label htmlFor="categories" className="mb-1 block text-xs font-medium">دسته‌بندی‌ها</label>
          <select id="categories" name="categories" multiple aria-label="انتخاب دسته بندی" className="h-32 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" defaultValue={a.categories}>
            {categoryOptions.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tags" className="mb-1 block text-xs font-medium">تگ‌ها</label>
          <select id="tags" name="tags" multiple aria-label="انتخاب تگ" className="h-32 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" defaultValue={a.tags}>
            {tagOptions.map((t) => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
        </div>
        
        {/* SEO Fields */}
        <div className="border-t border-border pt-4">
          <h2 className="text-base font-semibold mb-3">تنظیمات SEO</h2>
          
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="seoTitle" className="mb-1 block text-xs font-medium">
                عنوان SEO
              </label>
              <input 
                id="seoTitle" 
                name="seoTitle" 
                maxLength={70}
                defaultValue={a.seoTitle ?? ''}
                placeholder="عنوان برای موتورهای جستجو (حداکثر 70 کاراکتر)" 
                className="w-full rounded-md border px-3 py-2 text-sm" 
              />
              <p className="mt-1 text-xs text-muted-foreground">
                اگر خالی باشد، عنوان مقاله استفاده می‌شود
              </p>
            </div>

            <div>
              <label htmlFor="seoDescription" className="mb-1 block text-xs font-medium">
                توضیحات SEO
              </label>
              <textarea 
                id="seoDescription" 
                name="seoDescription" 
                rows={2}
                maxLength={160}
                defaultValue={a.seoDescription ?? ''}
                placeholder="توضیحات برای موتورهای جستجو (حداکثر 160 کاراکتر)" 
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                اگر خالی باشد، خلاصه مقاله استفاده می‌شود
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button type="submit" className="rounded-md border bg-primary px-4 py-2 text-sm text-primary-foreground">ذخیره</button>
        </div>
      </form>
    </div>
  );
}

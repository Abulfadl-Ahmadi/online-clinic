"use server";

import requireAuth from "@/actions/auth/requireAuth.action";
import { listCategories, listTags, createArticle } from "@/actions";
import { redirect } from "next/navigation";

export default async function AdminNewArticlePage() {
  await requireAuth({ requiredRoles: ["admin"], redirectPath: "/auth/login" });

  const [cats, tags] = await Promise.all([
    listCategories({ page: 1, ordering: "name" }),
    listTags({ page: 1, ordering: "name" }),
  ]);

  async function submit(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const summary = String(formData.get("summary") || "");
    const content = String(formData.get("content") || "");
    const coverImage = String(formData.get("coverImage") || "");
    const status = String(formData.get("status") || "draft") as "draft" | "published";
    const categories = (formData.getAll("categories") as string[]) || [];
    const tags = (formData.getAll("tags") as string[]) || [];
    
    const res = await createArticle({
      title,
      summary,
      content,
      coverImage: coverImage || null,
      status,
      categories,
      tags,
    });

    console.log("📋 Article creation result:", JSON.stringify(res, null, 2));

    if (res.success) {
      redirect(`/articles/${res.data.slug}`);
    } else {
      console.error("❌ Failed to create article:", res.message);
    }

    // TODO: handle error via search params or a flash store
  }

  const categoryOptions = cats.success ? cats.data.results : [];
  const tagOptions = tags.success ? tags.data.results : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">ایجاد مقاله جدید</h1>
      <form action={submit} className="flex flex-col gap-4" dir="rtl">
        <div>
          <label htmlFor="title" className="mb-1 block text-xs font-medium">عنوان</label>
          <input id="title" name="title" placeholder="عنوان مقاله" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label htmlFor="summary" className="mb-1 block text-xs font-medium">خلاصه</label>
          <textarea id="summary" name="summary" rows={3} placeholder="خلاصه کوتاه" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label htmlFor="content" className="mb-1 block text-xs font-medium">متن مقاله</label>
          <textarea id="content" name="content" rows={10} placeholder="متن کامل مقاله" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label htmlFor="coverImage" className="mb-1 block text-xs font-medium">تصویر کاور (URL)</label>
          <input id="coverImage" name="coverImage" placeholder="https://..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-xs font-medium">وضعیت</label>
          <select id="status" name="status" aria-label="وضعیت" className="rounded-md border border-border bg-background px-3 py-2 text-sm">
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشر شده</option>
          </select>
        </div>
        <div>
          <label htmlFor="categories" className="mb-1 block text-xs font-medium">دسته‌بندی‌ها</label>
          <select id="categories" name="categories" multiple aria-label="انتخاب دسته بندی" className="h-32 w-full rounded-md border bg-background px-3 py-2 text-sm">
            {categoryOptions.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tags" className="mb-1 block text-xs font-medium">تگ‌ها</label>
          <select id="tags" name="tags" multiple aria-label="انتخاب تگ" className="h-32 w-full rounded-md border bg-background px-3 py-2 text-sm">
            {tagOptions.map((t) => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="rounded-md border bg-primary px-4 py-2 text-sm text-primary-foreground">ایجاد</button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCategories, deleteCategory } from "@/actions";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    const res = await listCategories({ ordering: "name" });
    if (res.success) {
      setCategories(res.data.results);
    } else {
      toast.error("خطا در بارگذاری دسته‌بندی‌ها");
    }
    setLoading(false);
  }

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`آیا از حذف دسته‌بندی "${name}" مطمئن هستید؟`)) {
      return;
    }

    const res = await deleteCategory(slug);
    if (res.success) {
      toast.success("دسته‌بندی با موفقیت حذف شد");
      loadCategories();
    } else {
      toast.error(res.message || "خطا در حذف دسته‌بندی");
    }
  }

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        <Button asChild>
          <Link href="/admin/articles/categories/new">
            <Plus className="size-4 me-2" />
            دسته‌بندی جدید
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  شناسه (نامک): <code className="bg-muted px-1 rounded">{category.slug}</code>
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/admin/articles/categories/${category.slug}`}>
                      <Edit className="size-3.5 me-1" />
                      ویرایش
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.slug, category.name)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          هیچ دسته‌بندی‌ای یافت نشد
        </div>
      )}
    </div>
  );
}

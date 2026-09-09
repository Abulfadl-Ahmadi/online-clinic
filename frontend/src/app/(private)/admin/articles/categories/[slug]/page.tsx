"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCategory, updateCategory } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      const res = await getCategory(slug);
      if (res.success) {
        setName(res.data.name);
      } else {
        toast.error("خطا در بارگذاری دسته‌بندی");
        router.push("/admin/articles/categories");
      }
      setInitialLoading(false);
    }
    
    loadCategory();
  }, [slug, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("نام دسته‌بندی الزامی است");
      return;
    }

    setLoading(true);
    const res = await updateCategory(slug, name.trim());
    
    if (res.success) {
      toast.success("دسته‌بندی با موفقیت ویرایش شد");
      router.push("/admin/articles/categories");
    } else {
      toast.error(res.message || "خطا در ویرایش دسته‌بندی");
    }
    
    setLoading(false);
  }

  if (initialLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6" dir="rtl">
      <h1 className="text-2xl font-bold">ویرایش دسته‌بندی</h1>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">نامک (Slug - غیرقابل تغییر)</Label>
              <Input
                id="slug"
                value={slug}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">نام دسته‌بندی</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سلامت، تغذیه، ورزش"
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                لغو
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Spinner className="size-4 me-2" />}
                {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

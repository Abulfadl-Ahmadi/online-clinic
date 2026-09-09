"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTag } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function NewTagPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("نام تگ الزامی است");
      return;
    }

    setLoading(true);
    const res = await createTag(name.trim());
    
    if (res.success) {
      toast.success("تگ با موفقیت ایجاد شد");
      router.push("/admin/articles/tags");
    } else {
      toast.error(res.message || "خطا در ایجاد تگ");
    }
    
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6" dir="rtl">
      <h1 className="text-2xl font-bold">ایجاد تگ جدید</h1>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات تگ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">نام تگ</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سلامت، پزشکی، تغذیه"
                required
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                نامک (Slug) به صورت خودکار از نام ساخته می‌شود
              </p>
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
                {loading ? "در حال ایجاد..." : "ایجاد تگ"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface Option { label: string; value: string }
interface ArticlesFiltersProps {
  defaultSearch?: string;
  defaultOrdering?: string;
  defaultCategory?: string;
  defaultTag?: string;
  categories: Option[];
  tags: Option[];
  action: (formData: FormData) => Promise<void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="secondary" className="self-start md:self-auto">
      اعمال فیلترها
    </Button>
  );
}

export default function ArticlesFilters({ defaultSearch, defaultOrdering, defaultCategory, defaultTag, categories, tags, action }: ArticlesFiltersProps) {
  const [search, setSearch] = useState(defaultSearch || "");
  const [ordering, setOrdering] = useState(defaultOrdering || "-published_at");
  const [category, setCategory] = useState(defaultCategory || "all");
  const [tag, setTag] = useState(defaultTag || "all");

  return (
    <form action={action} className="grid gap-4 md:grid-cols-4 md:items-end">
      <input type="hidden" name="search" value={search} />
      <input type="hidden" name="ordering" value={ordering} />
      <input type="hidden" name="category" value={category === "all" ? "" : category} />
      <input type="hidden" name="tag" value={tag === "all" ? "" : tag} />
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium">جستجو</label>
        <Input
          placeholder="عنوان یا خلاصه..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="w-full">
        <label className="mb-1 block text-xs font-medium">ترتیب</label>
        <Select value={ordering} onValueChange={(val) => setOrdering(val)}>
          <SelectTrigger>
            <SelectValue placeholder="انتخاب" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="-published_at">جدیدترین</SelectItem>
              <SelectItem value="published_at">قدیمی‌تر</SelectItem>
              <SelectItem value="-created_at">ایجاد (جدیدترین)</SelectItem>
              <SelectItem value="title">عنوان (الفبا)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full">
        <label className="mb-1 block text-xs font-medium">دسته‌بندی</label>
        <Select value={category} onValueChange={(val) => setCategory(val)}>
          <SelectTrigger>
            <SelectValue placeholder="همه دسته‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">همه</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full">
        <label className="mb-1 block text-xs font-medium">برچسب</label>
        <Select value={tag} onValueChange={(val) => setTag(val)}>
          <SelectTrigger>
            <SelectValue placeholder="همه برچسب‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">همه</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-4">
        <SubmitButton />
      </div>
    </form>
  );
}

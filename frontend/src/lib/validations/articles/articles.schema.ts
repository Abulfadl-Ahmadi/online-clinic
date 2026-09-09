import { z } from "zod";

export const ArticleUpsertSchema = z.object({
  title: z.string().min(3, "عنوان حداقل ۳ کاراکتر"),
  summary: z.string().min(10, "خلاصه حداقل ۱۰ کاراکتر"),
  content: z.string().min(20, "متن مقاله حداقل ۲۰ کاراکتر"),
  coverImage: z.string().url("آدرس تصویر معتبر نیست").nullable().optional(),
  status: z.enum(["draft", "published"] as const),
  publishedAt: z.string().datetime().nullable().optional(),
  categories: z.array(z.string()).min(1, "حداقل یک دسته"),
  tags: z.array(z.string()).optional().default([]),
  seoTitle: z.string().max(70, "حداکثر ۷۰ کاراکتر").nullable().optional(),
  seoDescription: z.string().max(160, "حداکثر ۱۶۰ کاراکتر").nullable().optional(),
});

export type ArticleUpsertData = z.infer<typeof ArticleUpsertSchema>;

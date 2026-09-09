---
description: قوانین و استانداردهای توسعه فرانت‌اند با Next.js 15، TypeScript و Tailwind CSS
globs: "frontend/**"
---

# قوانین و استانداردهای فرانت‌اند (Next.js & React)

1. **معماری پوشه‌ها و کامپوننت‌ها:**
   - کامپوننت‌های عمومی در `src/components/ui/` و کامپوننت‌های دامنه‌محور در `src/components/clinic/` یا `src/components/articles/`.
   - تمام صفحات در `src/app/` با ساختار Route Group تفکیک شوند.

2. **Server Actions و ارتباط با شبکه:**
   - ارتباط با API جنگو صرفاً از طریق Server Actions در `src/actions/` انجام گیرد.
   - برای لاگین و نشست‌ها از کوکی‌های ایمن سرور (HTTP-only) استفاده شود.

3. **تایپ‌سیف بودن (TypeScript & Zod):**
   - هیچ کدی بدون تعریف صریح تایپ TypeScript نوشته نشود.
   - تمام پاسخ‌های API و فرم‌ها با اسکیماهای Zod اعتبارسنجی شوند.

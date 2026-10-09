import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ArticleDetailPage from "@/app/(public)/articles/[slug]/page";
import { getArticleDetail } from "@/actions";
import { notFound } from "next/navigation";

vi.mock("@/actions", () => ({ getArticleDetail: vi.fn(), listCategories: vi.fn(), listTags: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: vi.fn(() => { throw new Error("NOT_FOUND"); }) }));

describe("article detail failure", () => {
  it("offers recovery instead of reporting a missing article on temporary API failure", async () => {
    vi.mocked(getArticleDetail).mockResolvedValue({ success: false, message: "Rate limited", statusCode: 429, type: "TooManyRequests" });
    render(await ArticleDetailPage({ params: Promise.resolve({ slug: "example" }) }));
    expect(screen.getByRole("heading", { name: "مقاله فعلاً در دسترس نیست" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "بازگشت به مقاله‌ها" })).toHaveAttribute("href", "/articles");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("reserves 404 for an actually missing article", async () => {
    vi.mocked(getArticleDetail).mockResolvedValue({ success: false, message: "Not found", statusCode: 404, type: "NotFound" });
    await expect(ArticleDetailPage({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("NOT_FOUND");
    expect(notFound).toHaveBeenCalledOnce();
  });
});

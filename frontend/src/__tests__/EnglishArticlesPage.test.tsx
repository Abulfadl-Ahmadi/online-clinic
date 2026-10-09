import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EnglishArticlesPage from "@/app/en/articles/page";
import { listArticles } from "@/actions";

vi.mock("@/actions", () => ({ listArticles: vi.fn() }));
const list = vi.mocked(listArticles);

beforeEach(() => list.mockReset());

describe("English article archive pagination", () => {
  it("renders Persian text without inventing translations and links both page directions", async () => {
    list.mockResolvedValue({ success: true, message: "OK", data: {
      count: 30, next: "/api/articles/?page=3", previous: "/api/articles/?page=1",
      results: [{ id: "a", slug: "sample", title: "مقاله آزمایشی", summary: "خلاصه مقاله" }],
    } } as Awaited<ReturnType<typeof listArticles>>);
    render(await EnglishArticlesPage({ searchParams: Promise.resolve({ page: "2" }) }));
    expect(list).toHaveBeenCalledWith({ page: 2, ordering: "-published_at" });
    expect(screen.getByRole("heading", { name: "مقاله آزمایشی" })).toHaveAttribute("lang", "fa");
    expect(screen.getByRole("heading", { name: "مقاله آزمایشی" })).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("link", { name: "Read مقاله آزمایشی in Persian" })).toHaveAttribute("href", "/articles/sample");
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute("href", "/en/articles?page=1");
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/en/articles?page=3");
  });

  it("gives a way back from an empty page", async () => {
    list.mockResolvedValue({ success: true, message: "OK", data: { count: 0, next: null, previous: null, results: [] } } as Awaited<ReturnType<typeof listArticles>>);
    render(await EnglishArticlesPage({ searchParams: Promise.resolve({ page: "8" }) }));
    expect(screen.getByRole("link", { name: "Start from page one" })).toHaveAttribute("href", "/en/articles");
    expect(screen.queryByRole("link", { name: "Next" })).not.toBeInTheDocument();
  });

  it("does not offer pagination when the archive is unavailable", async () => {
    list.mockResolvedValue({ success: false, message: "unavailable", statusCode: 503, type: "Internal" } as Awaited<ReturnType<typeof listArticles>>);
    render(await EnglishArticlesPage({ searchParams: Promise.resolve({ page: "3" }) }));
    expect(screen.getByText(/temporarily unavailable/)).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Article pages" })).not.toBeInTheDocument();
  });
});

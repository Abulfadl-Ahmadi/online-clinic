import { buildArticlesQuery } from "@/lib/utils/articles-query";
import { describe, it, expect } from "vitest";

describe("buildArticlesQuery", () => {
  it("returns base when no params", () => {
    expect(buildArticlesQuery({})).toBe("/articles/articles/");
  });

  it("includes search and ordering and page", () => {
    const url = buildArticlesQuery({ page: 2, search: "sleep", ordering: "-published_at" });
    expect(url).toBe("/articles/articles/?page=2&search=sleep&ordering=-published_at");
  });

  it("maps category and tag to double-underscore keys", () => {
    const url = buildArticlesQuery({ categoriesSlug: "general-health", tagsSlug: "wellness" });
    expect(url).toContain("categories__slug=general-health");
    expect(url).toContain("tags__slug=wellness");
  });
});
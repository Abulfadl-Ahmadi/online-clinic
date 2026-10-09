import { describe, expect, it } from "vitest";
import { articlePageNumber } from "@/lib/utils/article-page-number";

describe("English article page input", () => {
  it.each([
    [undefined, 1], ["1", 1], ["3", 3], ["999999", 999999],
    ["0", 1], ["-2", 1], ["1.5", 1], ["01", 1], ["2x", 1],
    [["1", "2"], 1], ["9999999", 1],
  ] as const)("treats %s as page %i", (value, page) => {
    expect(articlePageNumber(value)).toBe(page);
  });
});

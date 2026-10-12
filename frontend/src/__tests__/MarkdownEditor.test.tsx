import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownEditor } from "@/components/articles/MarkdownEditor";

describe("MarkdownEditor", () => {
  it("inserts Markdown around a selection without submitting the form", () => {
    const submit = () => { throw Error("Toolbar submitted the form"); };
    render(<form onSubmit={submit}><MarkdownEditor defaultValue="توضیح درمان" /></form>);
    const editor = screen.getByRole("textbox", { name: /متن مقاله/ }) as HTMLTextAreaElement;
    editor.setSelectionRange(0, editor.value.length);
    fireEvent.click(screen.getByRole("button", { name: "پررنگ" }));
    expect(editor).toHaveValue("**توضیح درمان**");
    expect(editor).toHaveAttribute("name", "content");
  });

  it("shows a live preview without losing the submitted Markdown", () => {
    render(<MarkdownEditor defaultValue="## ارزیابی حرکت" />);
    fireEvent.click(screen.getByRole("button", { name: "پیش‌نمایش" }));
    expect(screen.getByRole("button", { name: "پیش‌نمایش" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "ارزیابی حرکت" })).toBeInTheDocument();
    expect(document.querySelector('textarea[name="content"]')).toHaveValue("## ارزیابی حرکت");
    fireEvent.click(screen.getByRole("button", { name: "نوشتن" }));
    expect(screen.getByRole("textbox", { name: /متن مقاله/ })).toHaveValue("## ارزیابی حرکت");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginLayout from "@/app/(public)/auth/login/layout";
import RegisterLayout from "@/app/(public)/auth/register/layout";
import { getSession } from "@/actions";

vi.mock("@/actions", () => ({ getSession: vi.fn() }));
vi.mock("@/components/preferences/ThemeSwitcher", () => ({ default: () => <button>تغییر تم</button> }));

it("provides a target for the login form skip link", async () => {
  vi.mocked(getSession).mockResolvedValue({ accessToken: null, userPayload: null } as Awaited<ReturnType<typeof getSession>>);
  render(await LoginLayout({ children: <h1>ورود</h1> }));
  expect(screen.getByRole("link", { name: "پرش به فرم ورود" })).toHaveAttribute("href", "#main-content");
  expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
});

describe("registration navigation", () => {
  it("provides a target for the registration skip link", () => {
    render(<RegisterLayout><h1>ثبت‌نام</h1></RegisterLayout>);
    expect(screen.getByRole("link", { name: "پرش به فرم ثبت‌نام" })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });
});

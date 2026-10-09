import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClinicFaq } from "@/components/clinic/ClinicFaq";

describe("ClinicFaq", () => {
  it("offers a booking-time check without exposing conflicting source hours", () => {
    render(<ClinicFaq />);
    fireEvent.click(screen.getByRole("button", { name: /برای بررسی کف پا، زانو و ستون فقرات/ }));
    expect(screen.getByText(/برای اطلاع از زمان‌های فعال و هماهنگی مراجعه/)).toBeInTheDocument();
    expect(screen.queryByText(/متن معرفی واحد|روزهای فعالیت آن با ساعات عمومی/)).not.toBeInTheDocument();
  });
});

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionDetail from "@/components/finance/TransactionDetail";
import { getTransactionDetail } from "@/actions";
import type { Transaction } from "@/types";

vi.mock("@/actions", () => ({ getTransactionDetail: vi.fn() }));

const transaction = { id: "new", status: "paid", statusDisplay: "پرداخت‌شده", description: "تراکنش تازه", amount: 1000, fee: 0, currency: "IRR", createdAt: "2026-10-01T10:00:00Z", updatedAt: "2026-10-01T10:00:00Z" } as Transaction;

describe("TransactionDetail", () => {
	it("shows a retry control after a rejected request", async () => {
		vi.mocked(getTransactionDetail).mockReset().mockRejectedValueOnce(new Error("Offline"));
		vi.mocked(getTransactionDetail).mockResolvedValueOnce({ success: true, message: "موفق", data: transaction });
		render(<TransactionDetail transactionId="new" />);
		await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("ارتباط با سرور برقرار نشد"));
		fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
		await waitFor(() => expect(getTransactionDetail).toHaveBeenCalledTimes(2));
		await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
	});

	it("does not replace a newer transaction with a late previous result", async () => {
		let resolveOld!: (value: Awaited<ReturnType<typeof getTransactionDetail>>) => void;
		vi.mocked(getTransactionDetail).mockReset().mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
		vi.mocked(getTransactionDetail).mockResolvedValueOnce({ success: true, message: "موفق", data: transaction });
		const { rerender } = render(<TransactionDetail transactionId="old" />);
		rerender(<TransactionDetail transactionId="new" />);
		await waitFor(() => expect(getTransactionDetail).toHaveBeenCalledWith("new"));
		await waitFor(() => expect(screen.getByText("تراکنش تازه")).toBeInTheDocument());
		resolveOld({ success: true, message: "موفق", data: { ...transaction, id: "old", description: "تراکنش قدیمی" } });
		await waitFor(() => expect(screen.getByText("تراکنش تازه")).toBeInTheDocument());
		expect(screen.queryByText("تراکنش قدیمی")).not.toBeInTheDocument();
	});
});

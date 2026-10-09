import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionsList from "@/components/finance/TransactionsList";
import { getTransactions } from "@/actions";

vi.mock("@/actions", () => ({ getTransactions: vi.fn() }));
const fetchTransactions = vi.mocked(getTransactions);

beforeEach(() => { fetchTransactions.mockReset(); });

describe("TransactionsList", () => {
	it("lets users reach the next page of an empty response", async () => {
		fetchTransactions.mockResolvedValueOnce({ success: true, message: "موفق", data: { count: 2, next: "?page=2", previous: null, results: [] } });
		fetchTransactions.mockResolvedValueOnce({ success: true, message: "موفق", data: { count: 2, next: null, previous: "?page=1", results: [] } });
		render(<TransactionsList />);
		fireEvent.click(await screen.findByRole("button", { name: "صفحه بعد" }));
		await waitFor(() => expect(fetchTransactions).toHaveBeenCalledWith(2));
		expect(await screen.findByRole("button", { name: "صفحه قبل" })).toBeEnabled();
	});

	it("shows a retry control when loading fails", async () => {
		fetchTransactions.mockResolvedValueOnce({ success: false, message: "خطای شبکه", statusCode: 503, type: "Internal" });
		fetchTransactions.mockResolvedValueOnce({ success: true, message: "موفق", data: { count: 0, next: null, previous: null, results: [] } });
		render(<TransactionsList />);
		expect(await screen.findByRole("alert")).toHaveTextContent("خطای شبکه");
		fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
		await waitFor(() => expect(fetchTransactions).toHaveBeenCalledTimes(2));
		expect(await screen.findByText("هیچ تراکنشی یافت نشد")).toBeInTheDocument();
	});
});

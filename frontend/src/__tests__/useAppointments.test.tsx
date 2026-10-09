import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useAppointments from "@/hooks/useAppointments";
import { cancelAppointment, getAppointments, getUpcomingAppointments } from "@/actions/clinic";
import { toast } from "sonner";
import type { Appointment } from "@/types";

vi.mock("@/actions/clinic", () => ({ getAppointments: vi.fn(), getUpcomingAppointments: vi.fn(), cancelAppointment: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

beforeEach(() => {
	vi.mocked(getAppointments).mockReset().mockResolvedValue({ success: true, message: "موفق", data: { count: 0, next: null, previous: null, results: [] } });
	vi.mocked(getUpcomingAppointments).mockReset().mockResolvedValue({ success: true, message: "موفق", data: [] });
	vi.mocked(cancelAppointment).mockReset();
	vi.mocked(toast.error).mockClear();
});

describe("useAppointments", () => {
	it("ignores a slow previous page after the next page arrives", async () => {
		let finishFirst!: (value: Awaited<ReturnType<typeof getAppointments>>) => void;
		vi.mocked(getAppointments).mockImplementationOnce(() => new Promise((resolve) => { finishFirst = resolve; }));
		vi.mocked(getAppointments).mockResolvedValueOnce({ success: true, message: "موفق", data: { count: 2, next: null, previous: "previous", results: [{ id: "second" } as Appointment] } });
		const { result } = renderHook(() => useAppointments());
		await waitFor(() => expect(getAppointments).toHaveBeenCalledWith(1));
		act(() => result.current.setPage(2));
		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.allAppointments[0]?.id).toBe("second");
		await act(async () => { finishFirst({ success: true, message: "موفق", data: { count: 2, next: "next", previous: null, results: [{ id: "first" } as Appointment] } }); });
		expect(result.current.allAppointments[0]?.id).toBe("second");
		expect(result.current.hasNext).toBe(false);
	});

	it("does not call protected endpoints before authentication is ready", async () => {
		const { result, rerender } = renderHook(({ enabled }) => useAppointments(enabled), { initialProps: { enabled: false } });
		expect(getAppointments).not.toHaveBeenCalled();
		expect(getUpcomingAppointments).not.toHaveBeenCalled();
		rerender({ enabled: true });
		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(getAppointments).toHaveBeenCalledWith(1);
		expect(getUpcomingAppointments).toHaveBeenCalledOnce();
	});

	it("keeps the upcoming tab usable when the paginated request rejects", async () => {
		vi.mocked(getAppointments).mockRejectedValueOnce(new Error("Network unavailable"));
		const { result } = renderHook(() => useAppointments());
		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.allError).toBe(true);
		expect(result.current.upcomingError).toBe(false);
		expect(result.current.upcomingAppointments).toEqual([]);
	});

	it("keeps the all-appointments tab usable when the upcoming request rejects", async () => {
		vi.mocked(getUpcomingAppointments).mockRejectedValueOnce(new Error("Network unavailable"));
		const { result } = renderHook(() => useAppointments());
		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.allError).toBe(false);
		expect(result.current.upcomingError).toBe(true);
	});

	it("keeps the dialog open and releases the loading state after cancellation throws", async () => {
		vi.mocked(cancelAppointment).mockRejectedValueOnce(new Error("Network unavailable"));
		const { result } = renderHook(() => useAppointments());
		await waitFor(() => expect(result.current.loading).toBe(false));
		act(() => result.current.openCancelDialog("appointment-1"));
		await act(async () => { await result.current.confirmCancel(); });
		expect(result.current.cancelDialogOpen).toBe(true);
		expect(result.current.cancelling).toBe(false);
		expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("دوباره تلاش کنید"));
	});
});

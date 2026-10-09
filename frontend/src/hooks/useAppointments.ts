"use client";

import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

import type { Appointment } from "@/types";
import {
	getAppointments,
	getUpcomingAppointments,
	cancelAppointment,
} from "@/actions/clinic";

export default function useAppointments(enabled = true) {
	const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
	const [upcomingAppointments, setUpcomingAppointments] = useState<
		Appointment[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [allError, setAllError] = useState(false);
	const [upcomingError, setUpcomingError] = useState(false);
	const [page, setPage] = useState(1);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrevious, setHasPrevious] = useState(false);

	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [appointmentToCancel, setAppointmentToCancel] = useState<
		string | null
	>(null);
	const [cancelReason, setCancelReason] = useState("");
	const [cancelling, setCancelling] = useState(false);
	const requestId = useRef(0);

	useEffect(() => {
		if (enabled) void loadAppointments();
		return () => { requestId.current += 1; };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, enabled]);

	async function loadAppointments() {
		if (!enabled) return;
		const currentRequest = ++requestId.current;
		setLoading(true);
		setAllError(false);
		setUpcomingError(false);
		try {
			const [allResult, upcomingResult] = await Promise.allSettled([
				getAppointments(page),
				getUpcomingAppointments(),
			]);
			if (currentRequest !== requestId.current) return;

			if (allResult.status === "fulfilled" && allResult.value.success) {
				setAllAppointments(allResult.value.data.results);
				setHasNext(Boolean(allResult.value.data.next));
				setHasPrevious(Boolean(allResult.value.data.previous));
			} else {
				setAllError(true);
			}
			if (upcomingResult.status === "fulfilled" && upcomingResult.value.success) {
				setUpcomingAppointments(upcomingResult.value.data);
			} else {
				setUpcomingError(true);
			}
		} finally {
			if (currentRequest === requestId.current) setLoading(false);
		}
	}

	function openCancelDialog(id: string) {
		setAppointmentToCancel(id);
		setCancelDialogOpen(true);
	}

	async function confirmCancel() {
		if (!appointmentToCancel || cancelling) return;
		setCancelling(true);
		try {
			const result = await cancelAppointment(appointmentToCancel, {
				reason: cancelReason,
			});

			if (result.success) {
				toast.success("نوبت با موفقیت لغو شد");
				setCancelDialogOpen(false);
				setAppointmentToCancel(null);
				setCancelReason("");
				await loadAppointments();
			} else {
				toast.error(result.message || "خطا در لغو نوبت");
			}
		} catch {
			toast.error("ارتباط با سرور برای لغو نوبت برقرار نشد. دوباره تلاش کنید.");
		} finally {
			setCancelling(false);
		}
	}

	return {
		allAppointments,
		upcomingAppointments,
		loading,
		allError,
		upcomingError,
		retry: loadAppointments,
		page,
		hasNext,
		hasPrevious,
		setPage,
		cancelDialogOpen,
		setCancelDialogOpen,
		cancelReason,
		setCancelReason,
		cancelling,
		openCancelDialog,
		confirmCancel,
	};
}

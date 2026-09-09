"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";

import type { Appointment } from "@/types";
import {
	getAppointments,
	getUpcomingAppointments,
	cancelAppointment,
} from "@/actions/clinic";

export default function useAppointments() {
	const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
	const [upcomingAppointments, setUpcomingAppointments] = useState<
		Appointment[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrevious, setHasPrevious] = useState(false);

	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [appointmentToCancel, setAppointmentToCancel] = useState<
		string | null
	>(null);
	const [cancelReason, setCancelReason] = useState("");
	const [cancelling, setCancelling] = useState(false);

	useEffect(() => {
		loadAppointments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	async function loadAppointments() {
		setLoading(true);
		try {
			const [allResult, upcomingResult] = await Promise.all([
				getAppointments(page),
				getUpcomingAppointments(),
			]);

			if (allResult.success) {
				setAllAppointments(allResult.data.results);
				setHasNext(!!allResult.data.next);
				setHasPrevious(!!allResult.data.previous);
			}
			if (upcomingResult.success) {
				setUpcomingAppointments(upcomingResult.data);
			}
		} catch (error: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("[useLoginForm]", error);
			}
			toast.error("خطا در دریافت داده‌ها");
		} finally {
			setLoading(false);
		}
	}

	function openCancelDialog(id: string) {
		setAppointmentToCancel(id);
		setCancelDialogOpen(true);
	}

	async function confirmCancel() {
		if (!appointmentToCancel) return;
		setCancelling(true);

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

		setCancelling(false);
	}

	return {
		allAppointments,
		upcomingAppointments,
		loading,
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

"use client";

import { useUser } from "@/context";
import { useAppointments } from "@/hooks";
import { AppointmentTabs, CancelDialog } from "@/components/clinic";

function DoctorAppointmentsPage() {
	const { isLoading, isAuthenticated, user, userRole } = useUser();

	const {
		allAppointments,
		upcomingAppointments,
		loading,
		page,
		hasNext,
		hasPrevious,
		setPage,
		cancelDialogOpen,
		setCancelReason,
		setCancelDialogOpen,
		cancelReason,
		cancelling,
		openCancelDialog,
		confirmCancel,
	} = useAppointments();

	if ((!isLoading && !isAuthenticated) || !user) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<p className="text-lg font-medium">
					برای دسترسی به این صفحه باید ابتدا وارد شوید
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8" dir="rtl">
			<header className="mb-8">
				<h1 className="text-3xl font-bold mb-2">نوبت‌های بیماران</h1>
				<p className="text-muted-foreground">
					مدیریت و پیگیری نوبت‌های رزرو شده بیماران
				</p>
			</header>

			<AppointmentTabs
				isDoctor={userRole === "doctor"}
				upcomingAppointments={upcomingAppointments}
				allAppointments={allAppointments}
				loading={loading}
				onCancel={openCancelDialog}
				page={page}
				hasNext={hasNext}
				hasPrevious={hasPrevious}
				onPageChange={setPage}
			/>

			<CancelDialog
				open={cancelDialogOpen}
				onOpenChange={setCancelDialogOpen}
				cancelReason={cancelReason}
				setCancelReason={setCancelReason}
				onConfirm={confirmCancel}
				cancelling={cancelling}
			/>
		</div>
	);
}

export default DoctorAppointmentsPage;

"use client";

import { useEffect, useState } from "react";

import { useUser } from "@/context";
import { RecurringAvailability } from "@/types";
import { getRecurringAvailability } from "@/actions/clinic";
import AvailabilityList from "@/components/clinic/AvailabilityList";
import AvailabilityDialog from "@/components/clinic/AvailabilityDialog";

function AvailabilityPage() {
	const { isLoading, isAuthenticated, user } = useUser();

	const [recurringAvailabilities, setRecurringAvailabilities] = useState<
		RecurringAvailability[] | null | undefined
	>(undefined);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isLoading && isAuthenticated && user) void loadRecurringAvailabilities();
	}, [isLoading, isAuthenticated, user]);

	const loadRecurringAvailabilities = async () => {
		setLoading(true);
		try {
			const result = await getRecurringAvailability();
			setRecurringAvailabilities(result.success ? result.data.results : null);
		} catch {
			setRecurringAvailabilities(null);
		} finally {
			setLoading(false);
		}
	};

	if (isLoading) {
		return <div role="status" className="p-6 text-muted-foreground">در حال بررسی حساب کاربری…</div>;
	}

	if (!isAuthenticated || !user) {
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
			<header className="flex items-center justify-between mb-8 w-full">
				<div>
					<h1 className="text-3xl font-bold mb-2">برنامهٔ پذیرش من</h1>
					<p className="text-muted-foreground">
						مدیریت و زمان‌بندی روزهای کاری و پذیرش بیماران
					</p>
				</div>
				<AvailabilityDialog
					mode="create"
					onSuccess={loadRecurringAvailabilities}
				/>
			</header>

			<AvailabilityList
				loading={loading}
				onRetry={loadRecurringAvailabilities}
				availabilities={recurringAvailabilities}
				onUpdated={loadRecurringAvailabilities}
				onDeleted={loadRecurringAvailabilities}
			/>
		</div>
	);
}

export default AvailabilityPage;

"use client";

import { RecurringAvailability } from "@/types";
import AvailabilityCard from "./AvailabilityCard";
import { Card, CardContent } from "@/components/ui";
import { Calendar, AlertCircle } from "lucide-react";

interface AvailabilityListProps {
	availabilities: RecurringAvailability[] | null | undefined;
	onUpdated?: () => void;
	onDeleted?: () => void;
}

export default function AvailabilityList({
	availabilities,
	onUpdated,
	onDeleted,
}: AvailabilityListProps) {
	if (availabilities === null || availabilities === undefined) {
		return (
			<Card className="border-dashed">
				<CardContent className="p-6">
					<div className="flex items-start gap-4">
						<AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" />
						<div>
							<h3 className="font-medium text-destructive mb-1">
								خطا در دریافت برنامه پذیرش
							</h3>
							<p className="text-sm text-muted-foreground">
								خطایی در بارگیری زمانبندی رخ داده است.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (availabilities.length === 0) {
		return (
			<Card className="border-dashed">
				<CardContent className="p-12 text-center flex flex-col items-center justify-center">
					<Calendar className="size-12 mb-4 opacity-50" />
					<h3 className="font-medium text-foreground mb-1">
						هیچ زمانبندی پذیرشی یافت نشد
					</h3>
					<p className="text-sm text-muted-foreground">
						شما هنوز هیچ برنامه پذیرشی تعریف نکردهایداز دکمه افزودن
						روز استفاده کنید.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{availabilities.map((availability) => (
				<AvailabilityCard
					key={availability.id}
					availability={availability}
					onUpdated={onUpdated}
					onDeleted={onDeleted}
				/>
			))}
		</div>
	);
}

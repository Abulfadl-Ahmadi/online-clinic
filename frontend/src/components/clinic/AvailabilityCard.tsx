"use client";

import { RecurringAvailability } from "@/types";
import { AppointmentType, DAYS_OF_WEEK } from "@/types/clinic.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceToman, formatTimeOnly, formatDateOnly } from "@/lib/utils";
import {
	CalendarDays,
	Clock,
	ArrowLeft,
	DollarSign,
	CheckCircle2,
	XCircle,
	Type,
	Timer,
	CalendarRange,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AvailabilityCardProps {
	availability: RecurringAvailability;
}

export default function AvailabilityCard({
	availability,
}: AvailabilityCardProps) {
	const dayLabel =
		DAYS_OF_WEEK.find(
			(d) => parseInt(d.value) === parseInt(availability.dayOfWeek),
		)?.label + " ها";

	const isActive = availability.isActive;
	const validFrom = availability.validFrom
		? formatDateOnly(availability.validFrom.toString())
		: "—";
	const validUntil = availability.validUntil
		? formatDateOnly(availability.validUntil.toString())
		: "—";

	return (
		<Card className="hover:shadow-md transition-all duration-300 border-border">
			<CardHeader className="pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<CalendarDays className="size-5 text-primary" />
					<CardTitle className="text-lg font-semibold">
						{dayLabel}
					</CardTitle>
				</div>

				<div className="flex items-center gap-2">
					<Badge
						variant={isActive ? "success" : "secondary"}
						className="flex items-center gap-1">
						{isActive ? (
							<>
								<CheckCircle2 className="size-3.5" /> فعال
							</>
						) : (
							<>
								<XCircle className="size-3.5" /> غیرفعال
							</>
						)}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
				{/* زمان‌ها */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Clock className="size-4" />
						<span>شروع</span>
					</div>
					<span className="font-medium text-foreground">
						{formatTimeOnly(availability.startTime)}
					</span>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 text-muted-foreground">
						<ArrowLeft className="size-4" />
						<span>پایان</span>
					</div>
					<span className="font-medium text-foreground">
						{formatTimeOnly(availability.endTime)}
					</span>
				</div>

				{/* مبلغ */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 text-muted-foreground">
						<DollarSign className="size-4" />
						<span>مبلغ</span>
					</div>
					<span className="font-medium text-foreground">
						{formatPriceToman(availability.priceIrr)} تومان
					</span>
				</div>

				{/* نوع نوبت */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Type className="size-4" />
						<span>نوع نوبت</span>
					</div>
					<span className="font-medium text-foreground">
						{getTypeDisplay(
							availability.appointmentType as AppointmentType,
						) || "-"}
					</span>
				</div>

				{/* مدت زمان */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Timer className="size-4" />
						<span>مدت زمان</span>
					</div>
					<span className="font-medium text-foreground">
						{availability.durationMinutes} دقیقه
					</span>
				</div>

				{/* بازه اعتبار */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 text-muted-foreground">
						<CalendarRange className="size-4" />
						<span>بازه اعتبار</span>
					</div>
					<span className="font-medium text-foreground">
						{validFrom} تا {validUntil}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}

function getTypeDisplay(type: AppointmentType) {
	switch (type) {
		case "consultation":
			return "ویزیت حضوری";
		case "follow_up":
			return "ویزیت تکمیلی";
		case "emergency":
			return "اورژانسی";
		default:
			return "اورژانسی";
	}
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RecurringAvailability } from "@/types";
import { AppointmentType, DAYS_OF_WEEK } from "@/types/clinic.types";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
	Badge,
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui";
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
	Pencil,
	Trash2,
} from "lucide-react";
import AvailabilityDialog from "./AvailabilityDialog";
import { deleteRecurringAvailability } from "@/actions/clinic";

interface AvailabilityCardProps {
	availability: RecurringAvailability;
	onUpdated?: () => void;
	onDeleted?: () => void;
}

export default function AvailabilityCard({
	availability,
	onUpdated,
	onDeleted,
}: AvailabilityCardProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

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

	async function handleDelete() {
		setIsDeleting(true);
		try {
			const res = await deleteRecurringAvailability(availability.id);
			if (res.success) {
				toast.success(res.message || "زمانبندی با موفقیت حذف شد");
				setDeleteDialogOpen(false);
				onDeleted?.();
			} else {
				toast.error(res.message || "خطا در حذف زمانبندی");
			}
		} catch {
			toast.error("خطای غیرمنتظره در حذف زمانبندی");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Card className="hover:shadow-md transition-all duration-300 border-border flex flex-col justify-between">
			<div>
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
					{/* زمانها */}
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
			</div>

			<CardFooter className="border-t pt-3 flex justify-end gap-2">
				{/* Edit Dialog */}
				<AvailabilityDialog
					mode="edit"
					availability={availability}
					onSuccess={onUpdated}
					trigger={
						<Button
							variant="outline"
							size="sm"
							className="gap-1.5 text-xs">
							<Pencil className="size-3.5" />
							ویرایش
						</Button>
					}
				/>

				{/* Delete Confirmation Dialog */}
				<Dialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
							<Trash2 className="size-3.5" />
							حذف
						</Button>
					</DialogTrigger>
					<DialogContent dir="rtl">
						<DialogHeader>
							<DialogTitle>حذف زمانبندی پذیرش</DialogTitle>
							<DialogDescription>
								آیا از حذف برنامه پذیرش برای {dayLabel} (
								{formatTimeOnly(availability.startTime)} تا{" "}
								{formatTimeOnly(availability.endTime)}) اطمینان
								دارید؟
							</DialogDescription>
						</DialogHeader>
						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								variant="outline"
								onClick={() => setDeleteDialogOpen(false)}
								disabled={isDeleting}>
								انصراف
							</Button>
							<Button
								variant="destructive"
								onClick={handleDelete}
								disabled={isDeleting}>
								{isDeleting ? "در حال حذف..." : "حذف زمانبندی"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardFooter>
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

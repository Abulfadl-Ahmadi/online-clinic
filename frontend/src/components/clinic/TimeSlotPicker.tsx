"use client";

import { Clock } from "lucide-react";
import { AvailableSlot } from "@/types";
import { formatDateOnly, formatTimeOnly } from "@/lib/utils";
import { Badge, Button, Card, CardContent } from "@/components/ui";

interface TimeSlotPickerProps {
	slots: AvailableSlot[];
	selectedSlot: AvailableSlot | null;
	onSelectSlot: (slot: AvailableSlot) => void;
}

export default function TimeSlotPicker({
	slots,
	selectedSlot,
	onSelectSlot,
}: TimeSlotPickerProps) {
	// Group slots by date
	const slotsByDate = slots.reduce((acc, slot) => {
		const date = slot.date;
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(slot);
		return acc;
	}, {} as Record<string, AvailableSlot[]>);

	const dates = Object.keys(slotsByDate).sort();

	if (dates.length === 0) {
		return (
			<Card>
				<CardContent className="text-center text-muted-foreground">
					نوبت خالی در این بازه زمانی وجود ندارد
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{dates.map((date) => {
				const dateSlots = slotsByDate[date];

				return (
					<div key={date}>
						<h3 className="text-lg font-semibold mb-3">
							{formatDateOnly(date)}
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
							{dateSlots.map((slot, index) => {
								const isSelected =
									selectedSlot?.date === slot.date &&
									selectedSlot?.startTime === slot.startTime;
								const isAvailable = slot.isAvailable;

								return (
									<Button
										key={`${slot.date}-${slot.startTime}-${index}`}
										variant={
											isSelected ? "default" : "outline"
										}
										className={`h-auto py-3 flex flex-col items-center gap-1 ${
											!isAvailable &&
											"opacity-50 cursor-not-allowed"
										}`}
										disabled={!isAvailable}
										onClick={() =>
											isAvailable && onSelectSlot(slot)
										}>
										<div className="flex items-center gap-1">
											<Clock className="size-4" />
											<span className="text-sm font-medium">
												از{" "}
												{formatTimeOnly(slot.startTime)}{" "}
												تا{" "}
												{formatTimeOnly(slot.endTime)}
											</span>
										</div>
										{!isAvailable && (
											<Badge
												variant="destructive"
												className="text-xs">
												رزرو شده
											</Badge>
										)}
									</Button>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
}

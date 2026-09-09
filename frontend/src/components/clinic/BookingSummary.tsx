"use client";

import { AvailableSlot } from "@/types";
import { formatDateOnly, formatPriceToman, formatTimeOnly } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui";
import { Calendar, Clock, Banknote } from "lucide-react";

interface BookingSummaryProps {
	slot: AvailableSlot;
}

export default function BookingSummary({ slot }: BookingSummaryProps) {
	const formattedPrice = formatPriceToman(slot.priceIrr);

	return (
		<Card className="bg-muted/50 border border-border">
			<CardContent className="p-4 flex flex-col gap-2">
				<h3 className="font-semibold">خلاصه رزرو</h3>
				<div className="flex items-center gap-2 text-sm">
					<Calendar className="size-4 text-primary" />
					<span>{formatDateOnly(slot.date)}</span>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<Clock className="size-4 text-primary" />
					<span>
						از {formatTimeOnly(slot.startTime)} تا{" "}
						{formatTimeOnly(slot.endTime)}{" "}
					</span>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<Banknote className="size-4 text-primary" />
					<span>{formattedPrice} تومان</span>
				</div>
			</CardContent>
		</Card>
	);
}

"use client";

import { useState } from "react";
import {
	Calendar,
	Clock,
	DollarSignIcon,
	ChevronDown,
	ChevronUp,
} from "lucide-react";

import { Appointment } from "@/types";
import { formatDate, formatPriceToman, formatTimeOnly } from "@/lib/utils";
import {
	getAppointmentStatusText,
	getAppointmentStatusVariant,
	getAppointmentTypeText,
	getPaymentStatus,
} from "@/lib/labels";
import { Badge, Button, Card, CardContent, CardHeader } from "@/components/ui";

interface AppointmentCardProps {
	appointment: Appointment;
	onCancel?: (appointmentId: string) => void;
	showCancelButton?: boolean;
	isDoctor: boolean;
}

export default function AppointmentCard({
	appointment,
	isDoctor,
}: // onCancel,
// showCancelButton = false,
AppointmentCardProps) {
	const [expanded, setExpanded] = useState(false);

	const startTime = formatTimeOnly(appointment.startTime);
	const endTime = formatTimeOnly(appointment.endTime);
	const formattedPrice = formatPriceToman(appointment.priceIrr);

	return (
		<Card dir="rtl" className="shadow-sm hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<h3 className="text-lg font-bold">
							{isDoctor ? (
								<>
									بیمار
									<span dir="ltr">
										{appointment.patientPhone}
									</span>
								</>
							) : (
								<span>دکتر {appointment.doctorName}</span>
							)}
						</h3>
						<p className="text-sm text-muted-foreground mt-1">
							{getAppointmentTypeText(appointment.appointmentType)}
						</p>
					</div>

					<div className="flex items-center gap-2 flex-wrap">
						<Badge
							variant={getAppointmentStatusVariant(appointment.status)}>
							{getAppointmentStatusText(appointment.status, appointment.statusDisplay)}
						</Badge>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setExpanded(!expanded)}
							className="p-0 size-6">
							{expanded ? (
								<ChevronUp className="size-4" />
							) : (
								<ChevronDown className="size-4" />
							)}
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex flex-col gap-4">
				{/* Main Appointment Info */}
				<AppointmentDetails
					date={appointment.appointmentDate}
					startTime={startTime}
					endTime={endTime}
					price={formattedPrice}
				/>

				{/* Expandable Info */}
				{expanded && (
					<div className="flex flex-col gap-2 pt-2 border-t text-sm text-muted-foreground">
						{appointment.patientNotes && (
							<div>
								<p className="font-medium mb-1">
									یادداشت بیمار:
								</p>
								<p>{appointment.patientNotes}</p>
							</div>
						)}

						{appointment.doctorNotes && (
							<div>
								<p className="font-medium mb-1">
									یادداشت پزشک:
								</p>
								<p>{appointment.doctorNotes}</p>
							</div>
						)}

							{appointment.paymentStatus && (
							<div className="flex items-center gap-2">
								<span className="font-medium">وضعیت پرداخت:</span>
								<PaymentStatusBadge status={appointment.paymentStatus} />
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

/* ==============================
   Helper Components & Functions
   ============================== */

interface AppointmentDetailsProps {
	date: string;
	startTime: string;
	endTime: string;
	price: string;
}

function AppointmentDetails({
	date,
	startTime,
	endTime,
	price,
}: AppointmentDetailsProps) {
	return (
		<div className="flex flex-col gap-2 text-sm text-muted-foreground">
			<DetailItem icon={<DollarSignIcon className="size-4" />}>
				{price} تومان
			</DetailItem>
			<DetailItem icon={<Calendar className="size-4" />}>
				{formatDate(date)}
			</DetailItem>
			<DetailItem icon={<Clock className="size-4" />}>
				از {startTime} تا {endTime}
			</DetailItem>
		</div>
	);
}

interface DetailItemProps {
	icon: React.ReactNode;
	children: React.ReactNode;
}

function DetailItem({ icon, children }: DetailItemProps) {
	return (
		<div className="flex items-center gap-2">
			{icon}
			<span>{children}</span>
		</div>
	);
}

/* ==============================
   Status Helpers
   ============================== */
function PaymentStatusBadge({ status }: { status: string }) {
	const info = getPaymentStatus(status);
	if (!info) {
		if (/[\u0600-\u06FF]/.test(status)) {
			return <Badge variant="outline">{status}</Badge>;
		}
		return <Badge variant="outline">نامشخص</Badge>;
	}
	return <Badge variant={info.variant}>{info.label}</Badge>;
}

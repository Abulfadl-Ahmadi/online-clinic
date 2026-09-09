"use client";

import { Appointment } from "@/types";
import { Skeleton } from "@/components/ui";
import AppointmentCard from "./AppointmentCard";

interface AppointmentListProps {
	loading: boolean;
	isDoctor: boolean;
	appointments: Appointment[];
	onCancel: (id: string) => void;
	showCancelButton?: (appointment: Appointment) => boolean;
}

export default function AppointmentList({
	appointments,
	loading,
	isDoctor,
	onCancel,
	showCancelButton = () => true,
}: AppointmentListProps) {
	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[...Array(9)].map((_, i) => (
					<Skeleton key={i} className="h-64" />
				))}
			</div>
		);
	}

	if (appointments.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">نوبتی وجود ندارد</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{appointments.map((appointment) => (
				<AppointmentCard
					key={appointment.id}
					isDoctor={isDoctor}
					appointment={appointment}
					onCancel={onCancel}
					showCancelButton={showCancelButton(appointment)}
				/>
			))}
		</div>
	);
}

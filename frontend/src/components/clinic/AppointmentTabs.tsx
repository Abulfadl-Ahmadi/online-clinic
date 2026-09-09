"use client";

import { Appointment } from "@/types";
import Pagination from "./Pagination";
import AppointmentList from "./AppointmentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

interface Props {
	isDoctor: boolean;
	upcomingAppointments: Appointment[];
	allAppointments: Appointment[];
	loading: boolean;
	onCancel: (id: string) => void;
	page: number;
	hasNext: boolean;
	hasPrevious: boolean;
	onPageChange: (page: number) => void;
}

function AppointmentTabs(props: Props) {
	return (
		<Tabs defaultValue="upcoming" className="flex flex-col gap-4" dir="rtl">
			{/* Segmented style */}
			<TabsList className="bg-muted rounded-full p-[3px] inline-flex gap-1 w-fit">
				<TabsTrigger
					value="upcoming"
					className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-1 text-sm font-medium">
					نوبت‌های آینده
				</TabsTrigger>

				<TabsTrigger
					value="all"
					className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-1 text-sm font-medium">
					تمام نوبت‌ها
				</TabsTrigger>
			</TabsList>

			<TabsContent value="upcoming">
				<AppointmentList
					isDoctor={props.isDoctor}
					loading={props.loading}
					onCancel={props.onCancel}
					appointments={props.upcomingAppointments}
				/>
			</TabsContent>

			<TabsContent value="all">
				<AppointmentList
					isDoctor={props.isDoctor}
					loading={props.loading}
					onCancel={props.onCancel}
					appointments={props.allAppointments}
					showCancelButton={(a) => a.status === "pending"}
				/>
				<Pagination
					page={props.page}
					hasNext={props.hasNext}
					hasPrevious={props.hasPrevious}
					onPageChange={props.onPageChange}
				/>
			</TabsContent>
		</Tabs>
	);
}

export default AppointmentTabs;

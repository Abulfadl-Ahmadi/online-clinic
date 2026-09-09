"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/context";
import { Appointment } from "@/types";
import { AppointmentCard } from "@/components/clinic";
import { getUpcomingAppointments } from "@/actions/clinic";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton,
} from "@/components/ui";

import { Calendar, User, ArrowLeft } from "lucide-react";

function DashboardPage() {
	const { isLoading, isAuthenticated, user, userRole } = useUser();
	const [upcomingAppointments, setUpcomingAppointments] = useState<
		Appointment[]
	>([]);
	const [loadingAppointments, setLoadingAppointments] = useState(true);

	useEffect(() => {
		if (isAuthenticated && user) {
			loadUpcomingAppointments();
		}
	}, [isAuthenticated, user]);

	const loadUpcomingAppointments = async () => {
		setLoadingAppointments(true);
		const result = await getUpcomingAppointments();

		if (result.success) {
			setUpcomingAppointments(result.data);
		}

		setLoadingAppointments(false);
	};

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
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">داشبورد</h1>
				<p className="text-muted-foreground">
					خوش آمدید، {user.profile.firstName ? `${user.profile.firstName} عزیز` : "کاربر گرامی"}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Quick Actions */}
				<div className="lg:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle>دسترسی سریع</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-2">
							{userRole !== "doctor" && (
								<>
									<Button asChild className="w-full justify-start">
										<Link href="/user/doctors">
											<Calendar className="size-4 me-2" />
											رزرو نوبت جدید
										</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										className="w-full justify-start">
										<Link href="/user/appointments">
											<User className="size-4 me-2" />
											مشاهده نوبت‌ها
										</Link>
									</Button>
								</>
							)}
							<Button
								asChild
								variant="outline"
								className="w-full justify-start">
								<Link href="/user/profile">
									<User className="size-4 me-2" />
									ویرایش پروفایل
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Upcoming Appointments */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>نوبت‌های آینده</CardTitle>
							<Button asChild variant="ghost" size="sm">
								<Link
									href={
										userRole !== "doctor"
											? "/user/appointments"
											: "/doctor/appointments"
									}>
									مشاهده همه
									<ArrowLeft className="size-4 me-2" />
								</Link>
							</Button>
						</CardHeader>
						<CardContent>
							{loadingAppointments ? (
								<div className="flex flex-col gap-4">
									<Skeleton className="h-48" />
									<Skeleton className="h-48" />
								</div>
							) : upcomingAppointments.length === 0 ? (
								<div className="text-center py-12">
									<Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
									<p className="text-muted-foreground mb-4">
										نوبت آینده‌ای ندارید
									</p>
									<Button asChild>
										<Link href="/user/doctors">
											رزرو نوبت جدید
										</Link>
									</Button>
								</div>
							) : (
								<div className="flex flex-col gap-4">
									{upcomingAppointments
										.slice(0, 3)
										.map((appointment) => (
											<AppointmentCard
												isDoctor={userRole === "doctor"}
												key={appointment.id}
												appointment={appointment}
											/>
										))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
export default DashboardPage;

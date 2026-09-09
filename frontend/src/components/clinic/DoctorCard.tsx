import Link from "next/link";
import {
	// Calendar,
	Clock,
	// , DollarSign
} from "lucide-react";

import { DoctorProfile } from "@/types";
// import { formatPriceToman } from "@/lib/utils";

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui";

interface DoctorCardProps {
	doctor: DoctorProfile;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
	// Format price
	// const formattedPrice = formatPriceToman(doctor.defaultPriceIrr);

	return (
		<Card className="hover:shadow-lg transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<h3 className="flex items-center gap-2 text-xl font-bold">
							<span>دکتر {doctor.fullName}</span>

							<div>
								{" "}
								{doctor.isAcceptingPatients ? (
									<Badge variant="success">پذیرش فعال</Badge>
								) : (
									<Badge variant="secondary">عدم پذیرش</Badge>
								)}
							</div>
						</h3>
						<span
							className="text-sm text-muted-foreground mt-1 text-end"
							dir="ltr">
							{doctor.phoneNumber}
						</span>
					</div>

					<div className="flex items-center gap-2 text-sm">
						<Clock className="size-4 text-muted-foreground" />
						<span>{doctor.defaultConsultationDuration} دقیقه</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex flex-col gap-4">
				{/* Specializations */}
				{doctor.specializations.length > 0 && (
					<div>
						<p className="text-sm font-medium mb-2">تخصص‌ها:</p>
						<div className="flex flex-wrap gap-2">
							{doctor.specializations.map((spec) => (
								<Badge key={spec.id} variant="outline">
									{spec.name}
								</Badge>
							))}
						</div>
					</div>
				)}

				{/* Bio */}
				{doctor.bio && (
					<p className="text-sm text-muted-foreground line-clamp-3">
						{doctor.bio}
					</p>
				)}
			</CardContent>

			<CardFooter>
				{doctor.isAcceptingPatients ? (
					<Button asChild className="w-full">
						<Link href={`/user/doctors/${doctor.id}`}>
							مشاهده و رزرو نوبت
						</Link>
					</Button>
				) : (
					<Button className="w-full" disabled>
						عدم امکان رزرو
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}

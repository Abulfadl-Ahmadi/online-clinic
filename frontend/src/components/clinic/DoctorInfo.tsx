"use client";

import { Award, FileText } from "lucide-react";

import { DoctorProfile } from "@/types";
// import { formatPriceToman } from "@/lib/utils";
import {
	Badge,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui";

interface DoctorInfoProps {
	doctor: DoctorProfile;
}

export default function DoctorInfo({ doctor }: DoctorInfoProps) {
	// const formattedPrice = formatPriceToman(doctor.defaultPriceIrr);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center text-2xl gap-2">
					<span>دکتر {doctor.fullName}</span>
					<div>
						{doctor.isAcceptingPatients ? (
							<Badge variant="success" className="w-fit">
								پذیرش فعال
							</Badge>
						) : (
							<Badge variant="secondary" className="w-fit">
								عدم پذیرش
							</Badge>
						)}
					</div>
				</CardTitle>
				<span
					className="text-sm text-muted-foreground mt-1 text-end"
					dir="ltr">
					{doctor.phoneNumber}
				</span>
			</CardHeader>

			<CardContent className="flex flex-col gap-6">
				{/* Specializations */}
				{doctor.specializations.length > 0 && (
					<div>
						<h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
							<Award className="size-4" />
							تخصص‌ها
						</h3>
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
					<div>
						<h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
							<FileText className="size-4" />
							درباره پزشک
						</h3>
						<p className="text-sm text-muted-foreground">
							{doctor.bio}
						</p>
					</div>
				)}

				{/* Info */}
				<div className="flex flex-col gap-3 pt-4 border-t">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							سابقه کار:
						</span>
						<span className="font-medium">
							{doctor.yearsOfExperience} سال
						</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							مدت ویزیت:
						</span>
						<span className="font-medium">
							{doctor.defaultConsultationDuration} دقیقه
						</span>
					</div>
					{/* <div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">هزینه:</span>
						<span className="font-medium">
							{formattedPrice} تومان
						</span>
					</div> */}
				</div>
			</CardContent>
		</Card>
	);
}

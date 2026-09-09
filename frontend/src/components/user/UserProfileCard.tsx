"use client";

import { CalendarIcon, IdCardIcon, UserIcon } from "lucide-react";

import { User, UserRole } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { getFullName, getGenderAccent, getRoleBadge } from "./userHelpers";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Separator,
} from "@/components/ui";

interface UserCardProps {
	user: User;
	userRole?: UserRole | null;
}

function UserProfileCard({ user, userRole }: UserCardProps) {
	const name = getFullName(user);
	const accentColor = getGenderAccent(user.profile.gender);

	return (
		<Card>
			<CardHeader className="flex flex-col items-center text-center gap-3 pb-0">
				<div
					className={cn(
						"p-[2px] rounded-full bg-gradient-to-tr",
						accentColor,
					)}>
					<Avatar className="size-20 border-2 border-background shadow-md">
						<AvatarImage
							src={user.profile.avatar ?? undefined}
							alt={name}
						/>
						<AvatarFallback className="text-lg font-semibold">
							{user.profile.firstName?.[0]?.toUpperCase() ??
								user.phoneNumber[0]}
						</AvatarFallback>
					</Avatar>
				</div>

				<CardTitle className="text-lg font-semibold tracking-tight flex flex-col items-center gap-1">
					{name}
					<div className="flex items-center justify-center gap-2">
						{getRoleBadge(userRole ?? null)}
					</div>
				</CardTitle>

				<div className="text-sm text-muted-foreground" dir="ltr">
					{user.phoneNumber}
				</div>
			</CardHeader>

			<CardContent className="mt-4 flex flex-col gap-4">
				<Separator />
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<UserIcon className="size-4" />
						<span>جنسیت:</span>
					</div>
					<div className="text-start font-medium">
						{user.profile.gender === "male"
							? "مرد"
							: user.profile.gender === "female"
							? "زن"
							: "سایر"}
					</div>

					<div className="flex items-center gap-2 text-muted-foreground">
						<IdCardIcon className="size-4" />
						<span>کد ملی:</span>
					</div>
					<div className="text-start font-medium">
						{user.profile.nationalCode ?? "—"}
					</div>

					<div className="flex items-center gap-2 text-muted-foreground">
						<CalendarIcon className="size-4" />
						<span>تاریخ تولد:</span>
					</div>
					<div className="text-start font-medium">
						{user.profile.birthday
							? formatDate(user.profile.birthday)
							: "—"}
					</div>

					<div className="flex items-center gap-2 text-muted-foreground">
						<CalendarIcon className="size-4" />
						<span>تاریخ عضویت:</span>
					</div>
					<div className="text-start font-medium">
						{formatDate(user.createdAt)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default UserProfileCard;

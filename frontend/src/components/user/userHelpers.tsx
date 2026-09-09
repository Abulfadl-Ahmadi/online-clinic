import { ReactNode } from "react";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { ThemeType, User, UserRole } from "@/types";
import {
	UserIcon,
	ShieldCheck,
	Stethoscope,
	IdCardIcon,
	CalendarIcon,
	MoonIcon,
	SunIcon,
	LaptopIcon,
} from "lucide-react";

// Get full name
export const getFullName = (user: User) => {
	return (
		[user.profile.firstName, user.profile.lastName]
			.filter(Boolean)
			.join(" ") || "کاربر"
	);
};

// Get gender icon
export const getGenderIcon = (gender: string) => {
	if (gender === "male") return <UserIcon className="size-4 text-info" />;
	if (gender === "female") return <UserIcon className="size-4 text-primary" />;
	return <UserIcon className="size-4 text-muted-foreground" />;
};

// Get role badge
export const getRoleBadge = (role: UserRole | null) => {
	const badges: Record<UserRole, ReactNode> = {
		admin: (
			<Badge variant="info">
				<ShieldCheck className="size-3" />
				مدیر سیستم
			</Badge>
		),
		doctor: (
			<Badge variant="success">
				<Stethoscope className="size-3" />
				پزشک
			</Badge>
		),
		user: (
			<Badge variant="secondary">
				<UserIcon className="size-3" />
				کاربر
			</Badge>
		),
	};
	return badges[role ?? "user"];
};

// Get accent color for avatar
export const getGenderAccent = (gender: string) => {
	if (gender === "male") return "from-info/70 to-info";
	if (gender === "female") return "from-primary/70 to-primary";
	return "from-muted-foreground/60 to-muted-foreground";
};

export const getThemeIcon = (theme: ThemeType) => {
	switch (theme) {
		case "dark":
			return <MoonIcon className="size-4 text-foreground" />;
		case "light":
			return <SunIcon className="size-4 text-warning" />;
		case "system":
			return <LaptopIcon className="size-4 text-info" />;
		default:
			return <SunIcon className="size-4 text-muted-foreground" />;
	}
};

export const getPersonalInfoItems = (
	user: User,
): { label: string; value: ReactNode; icon: ReactNode }[] => {
	const { gender, birthday, nationalCode } = user.profile;

	const genderText =
		gender === "male" ? "مرد" : gender === "female" ? "زن" : "سایر";

	return [
		{
			label: "جنسیت",
			value: genderText,
			icon: <UserIcon className="size-4" />,
		},
		{
			label: "کد ملی",
			value: nationalCode ?? "—",
			icon: <IdCardIcon className="size-4" />,
		},
		{
			label: "تاریخ تولد",
			value: birthday ? formatDate(birthday) : "—",
			icon: <CalendarIcon className="size-4" />,
		},
		{
			label: "تاریخ عضویت",
			value: formatDate(user.createdAt),
			icon: <CalendarIcon className="size-4" />,
		},
	];
};

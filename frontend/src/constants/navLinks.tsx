import { NavLink } from "@/types";
import {
	HomeIcon,
	InfoIcon,
	SheetIcon,
	BookOpenIcon,
	LayoutDashboardIcon,
	UserCogIcon,
	CreditCardIcon,
	UserCircleIcon,
	CalendarCheckIcon,
	StethoscopeIcon,
	CheckSquareIcon,
	PenSquareIcon,
	FolderIcon,
	TagIcon,
} from "lucide-react";

export const publicLinks: NavLink[] = [
	{ href: "/", label: "خانه", icon: <HomeIcon /> },
	{ href: "/resume", label: "رزومه", icon: <SheetIcon /> },
	{ href: "/clinic", label: "کلینیک", icon: <InfoIcon /> },
	{ href: "/about-us", label: "درباره ما", icon: <InfoIcon /> },
	{ href: "/articles", label: "مقالات", icon: <BookOpenIcon /> },
];

export const basePrivateLinks: NavLink[] = [
	{
		href: "/user/dashboard",
		label: "داشبورد",
		icon: <LayoutDashboardIcon />,
	},
	{
		href: "/user/profile",
		label: "پروفایل",
		icon: <UserCircleIcon />,
	},
];

export const userLinks: NavLink[] = [
	...basePrivateLinks,
	{
		href: "/user/appointments",
		label: "نوبت‌ها",
		icon: <CalendarCheckIcon />,
	},
	{
		href: "/user/doctors",
		label: "پزشکان",
		icon: <StethoscopeIcon />,
	},
	{
		href: "/user/transactions",
		label: "تراکنش‌ها",
		icon: <CreditCardIcon />,
	},
];

export const doctorLinks: NavLink[] = [
	...basePrivateLinks,
	{
		href: "/doctor/appointments",
		label: "نوبت‌ها",
		icon: <CalendarCheckIcon />,
	},
	{
		href: "/doctor/availability",
		label: "پذیرش",
		icon: <CheckSquareIcon />,
	},
];

export const adminLinks: NavLink[] = [
	{
		href: "/admin",
		label: "داشبورد ادمین",
		icon: <UserCogIcon />,
	},
	{
		href: "/admin/articles",
		label: "مقالات",
		icon: <BookOpenIcon />,
	},
	{
		href: "/admin/articles/new",
		label: "ایجاد مقاله",
		icon: <PenSquareIcon />,
	},
	{
		href: "/admin/articles/categories",
		label: "دسته‌بندی‌ها",
		icon: <FolderIcon />,
	},
	{
		href: "/admin/articles/tags",
		label: "تگ‌ها",
		icon: <TagIcon />,
	},
];

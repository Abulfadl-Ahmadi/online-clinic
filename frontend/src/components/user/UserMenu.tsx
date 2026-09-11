"use client";

import Link from "next/link";
import {
	LayoutDashboard,
	UserCog2Icon,
	UserIcon,
	UserCircleIcon,
	LogOutIcon,
	KeyRound,
} from "lucide-react";

import { useLogout } from "@/hooks";
import { useUser } from "@/context";
import { cn } from "@/lib/utils";
import { getFullName, getRoleBadge } from "./userHelpers";
import {
	Button,
	Avatar,
	AvatarImage,
	AvatarFallback,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui";

interface UserMenuProps {
	showName?: boolean;
	className?: string;
}

function UserMenu({ showName = false, className }: UserMenuProps) {
	const { handleLogout } = useLogout();
	const { isLoading, isAuthenticated, user, userRole } = useUser();

	if ((!isLoading && !isAuthenticated) || !user) {
		return (
			<Link href="/auth/login" className={showName ? "w-full" : undefined}>
				<Button
					variant="outline"
					size="sm"
					className={cn(
						showName ? "w-full justify-start rounded-xl" : "rounded-full",
						className,
					)}>
					ورود / ثبت‌نام
				</Button>
			</Link>
		);
	}

	const name = getFullName(user);
	const roleBadge = getRoleBadge(userRole);

	return (
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className={cn(
						"relative transition-all duration-200",
						showName
							? "w-full justify-start gap-2.5 h-auto py-2 px-2 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
							: "size-8 rounded-full p-0 hover:ring-2 hover:ring-primary/30",
						className,
					)}>
					<Avatar className="size-8 shrink-0 border border-border/50">
						<AvatarImage
							src={
								user.profile.avatar || ""
								// || "/default-avatar.png"
							}
							alt={name}
						/>
						<AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
							{user.profile.firstName?.[0]?.toUpperCase() || (
								<UserIcon size={16} />
							)}
						</AvatarFallback>
					</Avatar>

					{showName && (
						<div className="flex flex-col items-start text-start flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
							<span className="text-sm font-semibold text-foreground truncate w-full">
								{name}
							</span>
							<span
								className="text-xs text-muted-foreground truncate w-full text-start"
								dir="ltr">
								{user.phoneNumber}
							</span>
						</div>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-64 rounded-xl p-2 bg-popover shadow-md border border-border">
				{/* Header */}
				<DropdownMenuLabel className="flex flex-col flex-1 gap-1">
					<h3 className="text-base font-semibold flex items-center gap-2">
						{name} {roleBadge}
					</h3>

					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
						<span dir="ltr">{user.phoneNumber}</span>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Menu Items */}
				<DropdownMenuItem asChild>
					<Link
						href="/user/dashboard"
						className="w-full cursor-pointer flex items-center">
						<LayoutDashboard className="me-2 size-4 hover:text-primary" />
						داشبورد
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link
						href="/user/profile"
						className="w-full cursor-pointer flex items-center">
						<UserCircleIcon className="me-2 size-4 hover:text-primary" />
						پروفایل
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link
						href="/user/change-password"
						className="w-full cursor-pointer flex items-center">
						<KeyRound className="me-2 size-4 hover:text-primary" />
						تغییر رمز عبور
					</Link>
				</DropdownMenuItem>

				{userRole === "admin" && (
					<DropdownMenuItem asChild>
						<Link
							href="/admin"
							className="w-full cursor-pointer flex items-center">
							<UserCog2Icon className="me-2 size-4 hover:text-primary" />
							داشبورد مدیریت
						</Link>
					</DropdownMenuItem>
				)}

				<DropdownMenuSeparator />

				{/* Logout */}
				<DropdownMenuItem asChild variant="destructive">
					<button
						onClick={handleLogout}
						className="cursor-pointer w-full flex items-center">
						<LogOutIcon className="me-2 size-4" />
						خروج
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserMenu;

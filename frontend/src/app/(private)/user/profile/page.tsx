"use client";

import {
	UserCircleIcon,
	CalendarIcon,
	BadgeCheckIcon,
	IdCardIcon,
	LanguagesIcon,
	KeyRound,
} from "lucide-react";

import { useUser } from "@/context";
import { formatDate } from "@/lib/utils";
import {
	getFullName,
	getGenderIcon,
	getRoleBadge,
	getThemeIcon,
} from "@/components/user";
import { ChangePasswordForm } from "@/components/forms";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	// Button,
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Separator,
} from "@/components/ui";


function UserProfilePage() {
	const { isLoading, isAuthenticated, user, userRole } = useUser();

	if ((!isLoading && !isAuthenticated) || !user) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-20">
				<p className="text-lg font-medium text-muted-foreground">
					برای دسترسی به این صفحه باید ابتدا وارد شوید
				</p>
			</div>
		);
	}

	const { gender, birthday, avatar, nationalCode } = user.profile;

	const name = getFullName(user);
	const roleBadge = getRoleBadge(userRole);

	return (
		<div className="container max-w-2xl py-10 flex flex-col gap-8 mx-auto" dir="rtl">
			{/* Profile Header */}
			<Card className="shadow-sm border-border">
				<CardHeader className="flex flex-col sm:flex-row items-center gap-4">
					{/* Avatar */}
					<Avatar className="size-24 border border-border shadow-sm">
						<AvatarImage src={avatar ?? undefined} alt={name} />
						<AvatarFallback>
							<UserCircleIcon className="size-10 text-muted-foreground" />
						</AvatarFallback>
					</Avatar>

					{/* Basic Info */}
					<div className="flex flex-col flex-1 gap-1">
						<CardTitle className="text-xl font-semibold flex items-center gap-2">
							{name} {roleBadge}
						</CardTitle>

						<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
							<span dir="ltr">{user.phoneNumber}</span>
						</div>
					</div>
				</CardHeader>

				<CardContent className="flex flex-col gap-4">
					{/* Personal Info */}
					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground flex items-center gap-2">
							<UserCircleIcon className="size-4 text-primary" />
							اطلاعات شخصی
						</h2>
						<Separator />
						<div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
							{/* National Code */}
							<div className="flex items-center gap-2">
								<IdCardIcon className="size-4" />
								<div>
									<span className="block text-foreground font-medium">
										کد ملی:
									</span>
									{nationalCode ?? "—"}
								</div>
							</div>

							{/* Birthday */}
							<div className="flex items-center gap-2">
								<CalendarIcon className="size-4" />
								<div>
									<span className="block text-foreground font-medium">
										تاریخ تولد:
									</span>
									{birthday ? formatDate(birthday) : "—"}
								</div>
							</div>

							{/* Gender */}
							<div className="flex items-center gap-2">
								{getGenderIcon(user.profile.gender)}
								<div>
									<span className="block text-foreground font-medium">
										جنسیت:
									</span>
									{gender === "male"
										? "مرد"
										: gender === "female"
										? "زن"
										: "سایر"}
								</div>
							</div>

							{/* Joined At */}
							<div className="flex items-center gap-2">
								<CalendarIcon className="size-4" />
								<div>
									<span className="block text-foreground font-medium">
										تاریخ عضویت:
									</span>
									{formatDate(user.createdAt)}
								</div>
							</div>
						</div>
					</div>

					{/* Settings */}
					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground flex items-center gap-2">
							<BadgeCheckIcon className="size-4 text-primary" />
							تنظیمات حساب
						</h2>
						<Separator />
						<div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
							{/* Theme */}
							<div className="flex items-center gap-2">
								{getThemeIcon(user.settings.theme)}
								<div>
									<span className="block text-foreground font-medium">
										تم:
									</span>
									{user.settings.theme === "dark"
										? "تیره"
										: user.settings.theme === "light"
										? "روشن"
										: "سیستم"}
								</div>
							</div>

							{/* Language */}
							<div className="flex items-center gap-2">
								<LanguagesIcon className="size-4 text-primary" />
								<div>
									<span className="block text-foreground font-medium">
										زبان:
									</span>
									{user.settings.language === "fa"
										? "فارسی"
										: "English"}
								</div>
							</div>
						</div>
					</div>

					{/* Edit Button */}
					{/* <div className="pt-4 flex justify-center sm:justify-end">
						<Button
							size="sm"
							variant="outline"
							className="flex items-center gap-1">
							<BadgeCheckIcon className="w-4 h-4" />
							ویرایش پروفایل
						</Button>
					</div> */}
				</CardContent>
			</Card>

			{/* Security & Password Change */}
			<Card className="shadow-sm border-border" id="change-password">
				<CardHeader>
					<CardTitle className="text-lg font-semibold flex items-center gap-2">
						<KeyRound className="size-5 text-primary" />
						تغییر رمز عبور
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						برای افزایش امنیت حساب کاربری خود، می‌توانید در این بخش رمز عبور جدید تعیین کنید.
					</p>
				</CardHeader>
				<CardContent>
					<ChangePasswordForm />
				</CardContent>
			</Card>
		</div>
	);
}

export default UserProfilePage;


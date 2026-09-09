"use client";

import Link from "next/link";
import type { Route } from "next";
import { useUser } from "@/context";
import {
	BookOpen,
	FolderTree,
	Tag,
	PlusCircle,
	ArrowLeft,
	FileText,
	LayoutDashboard,
	ShieldCheck,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Button,
	Badge,
} from "@/components/ui";

function AdminPage() {
	const { isLoading, isAuthenticated, user } = useUser();

	if ((!isLoading && !isAuthenticated) || !user) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-20">
				<p className="text-lg font-medium text-muted-foreground">
					برای دسترسی به این صفحه باید ابتدا وارد شوید
				</p>
			</div>
		);
	}

	const sections: {
		title: string;
		description: string;
		href: Route;
		icon: React.ReactNode;
		badge: string;
		actionText: string;
	}[] = [
		{
			title: "مدیریت مقالات",
			description: "مشاهده، ویرایش و مدیریت تمامی مقالات منتشر شده و پیش‌نویس",
			href: "/admin/articles",
			icon: <BookOpen className="size-8 text-primary" />,
			badge: "محتوا",
			actionText: "مشاهده مقالات",
		},
		{
			title: "ایجاد مقاله جدید",
			description: "نگارش و انتشار مقاله جدید با امکانات دسته‌بندی و برچسب‌گذاری",
			href: "/admin/articles/new",
			icon: <PlusCircle className="size-8 text-primary" />,
			badge: "جدید",
			actionText: "افزودن مقاله",
		},
		{
			title: "دسته‌بندی‌ها",
			description: "مدیریت و سازمان‌دهی موضوعی دسته‌بندی‌های مقالات",
			href: "/admin/articles/categories",
			icon: <FolderTree className="size-8 text-primary" />,
			badge: "سازماندهی",
			actionText: "مدیریت دسته‌ها",
		},
		{
			title: "برچسب‌ها",
			description: "مدیریت تگ‌ها و کلمات کلیدی مقالات برای جستجوی بهتر",
			href: "/admin/articles/tags",
			icon: <Tag className="size-8 text-primary" />,
			badge: "برچسب‌گذاری",
			actionText: "مدیریت تگ‌ها",
		},
	];

	return (
		<div className="container mx-auto px-4 py-8 flex flex-col gap-8" dir="rtl">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<LayoutDashboard className="size-7 text-primary" />
						<h1 className="text-2xl sm:text-3xl font-bold text-foreground">
							داشبورد مدیریت سیستم
						</h1>
					</div>
					<p className="text-muted-foreground text-sm">
						خوش آمدید، {user.profile?.firstName || "مدیر گرامی"} • کنترل و مدیریت محتوای کلینیک آنلاین
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="info" className="flex items-center gap-1.5 px-3 py-1">
						<ShieldCheck className="size-4" />
						دسترسی مدیر ارشد
					</Badge>
				</div>
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{sections.map((section) => (
					<Card
						key={section.href}
						className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/40">
						<CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
							<div className="flex items-center gap-3">
								<div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
									{section.icon}
								</div>
								<div>
									<CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
										{section.title}
									</CardTitle>
									<Badge variant="secondary" className="mt-1 text-xs">
										{section.badge}
									</Badge>
								</div>
							</div>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<CardDescription className="text-sm leading-relaxed">
								{section.description}
							</CardDescription>
							<div className="pt-2">
								<Button asChild variant="outline" className="w-full justify-between group-hover:border-primary/50">
									<Link href={section.href}>
										<span>{section.actionText}</span>
										<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Quick Help / Info */}
			<Card className="bg-muted/40 border-border">
				<CardContent className="p-6">
					<div className="flex items-start gap-4">
						<FileText className="size-6 text-primary shrink-0 mt-0.5" />
						<div className="flex flex-col gap-1 text-sm">
							<p className="font-semibold text-foreground">
								راهنمای بخش مدیریت محتوا
							</p>
							<p className="text-muted-foreground leading-relaxed">
								از طریق این بخش می‌توانید مقالات علمی، نکات سلامت، دسته‌بندی‌ها و برچسب‌های وب‌سایت کلینیک را به صورت بلادرنگ مدیریت کنید. تمام تغییرات بلافاصله در بخش مقالات عمومی اعمال خواهند شد.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default AdminPage;

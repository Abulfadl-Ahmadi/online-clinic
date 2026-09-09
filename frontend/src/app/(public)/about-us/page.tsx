"use client";

import Image from "next/image";
import { useState } from "react";
import { Footer } from "@/components/layout";
import {
	Shield,
	Heart,
	Users,
	Award,
	Target,
	Eye,
	Sparkles,
	TrendingUp,
	CheckCircle,
	Globe,
	Star,
	Lightbulb,
	Handshake,
} from "lucide-react";

export default function AboutUsPage() {
	const [activeTab, setActiveTab] = useState("mission");

	const values = [
		{
			icon: <Heart className="size-10 text-primary" />,
			title: "مراقبت از بیمار",
			description: "سلامتی و رضایت بیماران در اولویت اول ماست",
		},
		{
			icon: <Shield className="size-10 text-info" />,
			title: "امنیت و اعتماد",
			description: "حفظ حریم خصوصی و امنیت اطلاعات پزشکی",
		},
		{
			icon: <Sparkles className="size-10 text-warning" />,
			title: "کیفیت برتر",
			description: "ارائه خدمات با بالاترین استانداردهای کیفی",
		},
		{
			icon: <Lightbulb className="size-10 text-primary" />,
			title: "نوآوری",
			description: "استفاده از جدیدترین تکنولوژی‌های پزشکی",
		},
	];

	const timeline = [
		{
			year: "۱۳۹۸",
			title: "تاسیس شرکت",
			description: "آغاز فعالیت با تیم کوچک و رویای بزرگ",
		},
		{
			year: "۱۳۹۹",
			title: "رشد سریع",
			description: "افزایش به ۱۰۰۰ بیمار و ۵۰ پزشک",
		},
		{
			year: "۱۴۰۰",
			title: "گسترش خدمات",
			description: "راه‌اندازی مشاوره ویدیویی و نوبت‌دهی آنلاین",
		},
		{
			year: "۱۴۰۱",
			title: "توسعه ملی",
			description: "پوشش تمامی استان‌های کشور",
		},
		{
			year: "۱۴۰۲",
			title: "جوایز ملی",
			description: "دریافت جایزه بهترین پلتفرم سلامت دیجیتال",
		},
		{
			year: "۱۴۰۳",
			title: "رهبری بازار",
			description: "بیش از ۵۰۰۰ بیمار راضی و ۲۰۰+ پزشک",
		},
	];

	const achievements = [
		{
			icon: <Users className="size-8" />,
			number: "+۵۰۰۰",
			label: "بیمار راضی",
			color: "bg-primary/15 text-primary",
		},
		{
			icon: <Award className="size-8" />,
			number: "+۲۰۰",
			label: "پزشک متخصص",
			color: "bg-success/15 text-success",
		},
		{
			icon: <Star className="size-8" />,
			number: "۴.۹",
			label: "امتیاز کاربران",
			color: "bg-warning/15 text-warning",
		},
		{
			icon: <Globe className="size-8" />,
			number: "۳۱",
			label: "استان کشور",
			color: "bg-info/15 text-info",
		},
	];

	const certifications = [
		"مجوز از سازمان نظام پزشکی",
		"گواهی ISO 27001 امنیت اطلاعات",
		"تاییدیه وزارت بهداشت",
		"استاندارد بین‌المللی HIPAA",
		"گواهی کیفیت خدمات پزشکی",
		"عضو انجمن پزشکی دیجیتال ایران",
	];

	return (
		<div className="min-h-screen bg-background text-foreground" dir="rtl">
			{/* Hero Section */}
			<section className="pt-32 pb-20 px-4">
				{/* <div className="absolute inset-0 bg-primary rounded-3xl opacity-10 blur-3xl"></div> */}
				<div className="container mx-auto text-center">
					<h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
						درباره کلینیک آنلاین
					</h1>
					<p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						ما با هدف تحول در نظام سلامت و دسترسی آسان همه افراد به
						خدمات پزشکی با کیفیت تاسیس شدیم
					</p>
				</div>
			</section>

			{/* Stats Overview */}
			<section className="py-12 px-4 -mt-12">
				<div className="container mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{achievements.map((achievement, index) => (
							<div
								key={index}
								className="bg-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl">
								<div className="p-6 text-center">
									<div
										className={`size-16 ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
										{achievement.icon}
									</div>
									<div className="text-3xl font-bold text-foreground mb-2">
										{achievement.number}
									</div>
									<div className="text-muted-foreground">
										{achievement.label}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Story Section */}
			<section id="story" className="py-20 px-4">
				<div className="container mx-auto">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<h2 className="text-4xl font-bold text-foreground mb-6">
								داستان ما
							</h2>
							<p className="text-lg text-muted-foreground leading-relaxed">
								کلینیک آنلاین در سال ۱۳۹۸ با هدف ایجاد تحول در
								صنعت سلامت و دسترسی آسان‌تر به خدمات پزشکی تاسیس
								شد. ما باور داریم که هر فردی حق دارد به راحتی و
								با کیفیت بالا به پزشکان متخصص دسترسی داشته باشد.
							</p>
							<p className="text-lg text-muted-foreground leading-relaxed">
								با شروع فعالیت با تیمی کوچک اما پرانگیزه، امروز
								به بزرگ‌ترین پلتفرم مشاوره پزشکی آنلاین در کشور
								تبدیل شده‌ایم. مسیر ما پر از چالش‌ها و موفقیت‌ها
								بوده است، اما همیشه هدف ما ارائه بهترین خدمات به
								بیماران بوده است.
							</p>
							<p className="text-lg text-muted-foreground leading-relaxed">
								امروز بیش از ۵۰۰۰ بیمار به ما اعتماد کرده‌اند و
								بیش از ۲۰۰ پزشک متخصص با ما همکاری می‌کنند. این
								موفقیت نتیجه تلاش مستمر تیم ما و اعتماد شما
								عزیزان است.
							</p>
						</div>
						<div className="relative">
							<div className="absolute inset-0 bg-primary rounded-3xl opacity-10 blur-3xl"></div>
							<Image
								loading="eager"
								priority
								width={600}
								height={600}
								alt="تیم ما"
								src="/images/general/surgery-room.jpg"
								className="relative rounded-3xl shadow-2xl w-60 sm:w-96 h-full mx-auto"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-20 px-4 bg-muted/30">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							ماموریت و چشم‌انداز ما
						</h2>
					</div>

					<div className="flex justify-center gap-4 mb-8">
						<button
							onClick={() => setActiveTab("mission")}
							className={`px-8 py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
								activeTab === "mission"
									? "bg-primary text-primary-foreground shadow-lg"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}>
							<Target className="size-5" />
							ماموریت
						</button>
						<button
							onClick={() => setActiveTab("vision")}
							className={`px-8 py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
								activeTab === "vision"
									? "bg-primary text-primary-foreground shadow-lg"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}>
							<Eye className="size-5" />
							چشم‌انداز
						</button>
					</div>

					<div className="border border-border shadow-2xl bg-card rounded-2xl">
						<div className="p-12">
							{activeTab === "mission" ? (
								<div className="flex flex-col gap-6">
									<div className="flex items-start gap-4">
										<div className="size-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
											<CheckCircle className="size-6 text-primary" />
										</div>
										<div>
											<h3 className="text-xl font-bold text-foreground mb-2">
												دسترسی آسان به خدمات پزشکی
											</h3>
											<p className="text-muted-foreground leading-relaxed">
												حذف موانع جغرافیایی و زمانی برای
												دریافت خدمات پزشکی با کیفیت
											</p>
										</div>
									</div>
									<div className="flex items-start gap-4">
										<div className="size-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
											<CheckCircle className="size-6 text-primary" />
										</div>
										<div>
											<h3 className="text-xl font-bold text-foreground mb-2">
												ارتقای کیفیت خدمات سلامت
											</h3>
											<p className="text-muted-foreground leading-relaxed">
												استفاده از تکنولوژی برای بهبود
												تجربه بیماران و پزشکان
											</p>
										</div>
									</div>
									<div className="flex items-start gap-4">
										<div className="size-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
											<CheckCircle className="size-6 text-primary" />
										</div>
										<div>
											<h3 className="text-xl font-bold text-foreground mb-2">
												حفظ حریم خصوصی و امنیت
											</h3>
											<p className="text-muted-foreground leading-relaxed">
												تضمین امنیت کامل اطلاعات پزشکی و
												حفظ حریم خصوصی بیماران
											</p>
										</div>
									</div>
								</div>
							) : (
								<div className="flex flex-col gap-6">
									<p className="text-xl text-muted-foreground leading-relaxed text-center mb-8">
										ما می‌خواهیم تا سال ۱۴۱۰ به پیشرو صنعت
										سلامت دیجیتال در منطقه تبدیل شویم
									</p>
									<div className="grid md:grid-cols-3 gap-6">
										<div className="text-center p-6 bg-muted/60 border border-border rounded-xl">
											<TrendingUp className="size-12 text-primary mx-auto mb-4" />
											<h4 className="font-bold text-foreground mb-2">
												رشد پایدار
											</h4>
											<p className="text-muted-foreground">
												توسعه مستمر خدمات و افزایش پوشش
											</p>
										</div>
										<div className="text-center p-6 bg-muted/60 border border-border rounded-xl">
											<Lightbulb className="size-12 text-warning mx-auto mb-4" />
											<h4 className="font-bold text-foreground mb-2">
												نوآوری
											</h4>
											<p className="text-muted-foreground">
												استفاده از هوش مصنوعی و
												فناوری‌های نوین
											</p>
										</div>
										<div className="text-center p-6 bg-muted/60 border border-border rounded-xl">
											<Handshake className="size-12 text-success mx-auto mb-4" />
											<h4 className="font-bold text-foreground mb-2">
												شراکت
											</h4>
											<p className="text-muted-foreground">
												همکاری با بهترین مراکز درمانی
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section id="values" className="py-20 px-4 bg-muted/30 border-y border-border">
				<div className="container mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							ارزش‌های ما
						</h2>
						<p className="text-xl text-muted-foreground">
							اصولی که ما را هدایت می‌کنند
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{values.map((value, index) => (
							<div
								key={index}
								className="border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group bg-card rounded-2xl">
								<div className="p-8 text-center">
									<div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform">
										{value.icon}
									</div>
									<h3 className="text-xl font-bold text-foreground mb-3">
										{value.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{value.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Timeline */}
			<section className="py-20 px-4 bg-background">
				<div className="container mx-auto max-w-5xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							سفر ما
						</h2>
						<p className="text-xl text-muted-foreground">
							نگاهی به دستاوردهای ما در طول سال‌ها
						</p>
					</div>

					<div className="relative">
						<div className="absolute right-1/2 top-0 bottom-0 w-1 bg-primary transform translate-x-1/2 hidden md:block"></div>

						<div className="space-y-12">
							{timeline.map((item, index) => (
								<div
									key={index}
									className={`flex items-center gap-8 ${
										index % 2 === 0
											? "md:flex-row"
											: "md:flex-row-reverse"
									}`}>
									<div
										className={`flex-1 ${
											index % 2 === 0
												? "md:text-left"
												: "md:text-right"
										}`}>
										<div className="border border-border shadow-sm hover:shadow-md transition-shadow bg-card rounded-2xl">
											<div className="p-6">
												<div className="text-3xl font-bold text-primary mb-2">
													{item.year}
												</div>
												<h3 className="text-xl font-bold text-foreground mb-2">
													{item.title}
												</h3>
												<p className="text-muted-foreground">
													{item.description}
												</p>
											</div>
										</div>
									</div>

									<div className="hidden md:block w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg z-10"></div>

									<div className="flex-1"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Certifications */}
			<section
				id="achievements"
				className="py-20 px-4 bg-muted/30 border-t border-border">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							مجوزها و گواهینامه‌ها
						</h2>
						<p className="text-xl text-muted-foreground">
							تایید شده توسط مراجع معتبر
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						{certifications.map((cert, index) => (
							<div
								key={index}
								className="border border-border shadow-sm hover:shadow-md transition-all bg-card rounded-2xl">
								<div className="p-6 flex items-center gap-4">
									<div className="w-12 h-12 bg-success/15 rounded-full flex items-center justify-center flex-shrink-0">
										<CheckCircle className="w-6 h-6 text-success" />
									</div>
									<p className="text-foreground font-medium">
										{cert}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
}

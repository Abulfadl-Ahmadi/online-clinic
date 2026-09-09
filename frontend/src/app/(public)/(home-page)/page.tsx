"use client";

import { useState } from "react";
import {
	Calendar,
	Clock,
	Shield,
	CheckCircle,
	Star,
	ArrowLeft,
	Phone,
	Mail,
	MapPin,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { Footer } from "@/components/layout";

export default function HomePage() {
	const [currentTestimonial, setCurrentTestimonial] = useState(0);

	const services = [
		{
			icon: <Calendar className="size-12 text-primary" />,
			title: "نوبت‌دهی آنلاین",
			description:
				"رزرو آنلاین نوبت با پزشکان برتر بدون نیاز به صف و انتظار",
		},
		{
			icon: <Clock className="size-12 text-primary" />,
			title: "دسترسی ۲۴/۷",
			description: "خدمات پزشکی در تمام ساعات شبانه‌روز در اختیار شما",
		},
		{
			icon: <Shield className="size-12 text-primary" />,
			title: "امنیت اطلاعات",
			description: "حفاظت کامل از اطلاعات پزشکی و حریم خصوصی شما",
		},
	];

	const testimonials = [
		{
			name: "علی محمدی",
			text: "خدمات عالی و پزشکان حرفه‌ای. توانستم بدون اتلاف وقت با متخصص مشورت کنم.",
			rating: 5,
		},
		{
			name: "مریم حسینی",
			text: "پلتفرم بسیار کاربرپسند و امن. به همه توصیه می‌کنم.",
			rating: 5,
		},
		{
			name: "رضا کاظمی",
			text: "امکان مشاوره ویدیویی واقعاً راحتی بزرگی بود. ممنون از تیم شما.",
			rating: 5,
		},
	];

	const stats = [
		{ number: "+۵۰۰۰", label: "بیمار راضی" },
		{ number: "+۲۰۰", label: "پزشک متخصص" },
		{ number: "۲۴/۷", label: "پشتیبانی" },
		{ number: "۹۸٪", label: "رضایت کاربران" },
	];

	const nextTestimonial = () => {
		setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentTestimonial(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length,
		);
	};

	return (
		<div className="min-h-screen bg-background text-foreground" dir="rtl">
			{/* Hero Section */}
			<section className="pt-32 pb-20 px-4">
				<div className="container mx-auto">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-6 animate-fadeIn">
							<h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
								مراقبت از سلامتی
								<span className="text-primary">
									{" "}
									در هر زمان و مکان
								</span>
							</h1>
							<p className="text-xl text-muted-foreground leading-relaxed">
								دسترسی آسان به بهترین پزشکان متخصص از طریق
								پلتفرم پیشرفته مشاوره آنلاین. سلامتی شما، اولویت
								ماست.
							</p>
							<Link
								href={"/auth/login"}
								className="flex flex-col sm:flex-row gap-4">
								<Button
									size={"lg"}
									className="text-lg px-8 py-6
									rounded-xl shadow-lg hover:shadow-xl transition-all">
									رزرو نوبت آنلاین
									<ArrowLeft className="me-2 size-5" />
								</Button>
							</Link>

							{/* Stats */}
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
								{stats.map((stat, index) => (
									<div key={index} className="text-center">
										<div className="text-3xl font-bold text-primary">
											{stat.number}
										</div>
										<div className="text-sm text-muted-foreground mt-1">
											{stat.label}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="relative">
							<div className="absolute inset-0 bg-primary rounded-3xl opacity-10 blur-3xl"></div>
							<Image
								loading="eager"
								priority
								width={600}
								height={600}
								src="/images/general/doctor.jpg"
								alt="پزشک"
								className="relative rounded-3xl shadow-2xl w-60 sm:w-96 h-full mx-auto"
							/>
							<div className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-xl p-6 max-w-xs border border-border">
								<div className="flex items-center gap-4">
									<div className="size-12 bg-success/15 rounded-full flex items-center justify-center">
										<CheckCircle className="size-6 text-success" />
									</div>
									<div>
										<div className="font-bold text-foreground">
											مشاوره موفق
										</div>
										<div className="text-sm text-muted-foreground">
											+۵۰۰۰ بیمار راضی
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section
				id="services"
				className="py-20 px-4 bg-muted/30">
				<div className="container mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							خدمات ما
						</h2>
						<p className="text-xl text-muted-foreground">
							راه‌حل‌های جامع برای سلامتی شما
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{services.map((service, index) => (
							<div
								key={index}
								className="bg-card border-0 shadow-lg hover:shadow-2xl transition-all
								duration-300 hover:-translate-y-2 rounded-2xl">
								<div className="p-8 text-center">
									<div className="mb-6 flex justify-center">
										{service.icon}
									</div>
									<h3 className="text-xl font-bold text-foreground mb-3">
										{service.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{service.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section
				id="testimonials"
				className="py-20 px-4">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							نظرات بیماران
						</h2>
						<p className="text-xl text-muted-foreground">
							آنچه بیماران ما درباره ما می‌گویند
						</p>
					</div>

					<div className="border border-border shadow-2xl bg-card rounded-2xl">
						<div className="p-12">
							<div className="flex justify-center mb-6">
								{[
									...Array(
										testimonials[currentTestimonial].rating,
									),
								].map((_, i) => (
									<Star
										key={i}
										className="size-8 text-warning fill-warning"
									/>
								))}
							</div>
							<p className="text-2xl text-muted-foreground text-center leading-relaxed mb-8">
								{testimonials[currentTestimonial].text}
							</p>
							<p className="text-xl font-bold text-center text-foreground">
								{testimonials[currentTestimonial].name}
							</p>

							<div className="flex justify-center gap-4 mt-8">
								<button
									onClick={prevTestimonial}
									className="p-3 rounded-full bg-accent/80 hover:bg-accent transition-colors cursor-pointer">
									<ChevronRight className="size-6 text-primary" />
								</button>
								<button
									onClick={nextTestimonial}
									className="p-3 rounded-full bg-accent/80 hover:bg-accent transition-colors cursor-pointer">
									<ChevronLeft className="size-6 text-primary" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
					<div className="relative z-10">
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							آماده دریافت مشاوره پزشکی هستید؟
						</h2>
						<p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
							همین حالا ثبت‌نام کنید و اولین مشاوره خود را به آسانی دریافت کنید
						</p>
						<Link href={"/auth/login"}>
							<Button
								variant="secondary"
								size="lg"
								className="text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all">
								شروع کنید
								<ArrowLeft className="me-2 size-5" />
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="py-20 px-4 bg-muted/30">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							تماس با ما
						</h2>
						<p className="text-xl text-muted-foreground">
							ما آماده پاسخگویی به سوالات شما هستیم
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow bg-card rounded-2xl">
							<div className="p-8">
								<div className="size-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
									<Phone className="size-8 text-primary" />
								</div>
								<h3 className="font-bold text-foreground mb-2">
									تلفن
								</h3>
								<p className="text-muted-foreground">
									۰۲۱-۱۲۳۴۵۶۷۸
								</p>
							</div>
						</div>

						<div className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow bg-card rounded-2xl">
							<div className="p-8">
								<div className="size-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
									<Mail className="size-8 text-primary" />
								</div>
								<h3 className="font-bold text-foreground mb-2">
									ایمیل
								</h3>
								<p className="text-muted-foreground">
									info@clinic.ir
								</p>
							</div>
						</div>

						<div className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow bg-card rounded-2xl">
							<div className="p-8">
								<div className="size-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
									<MapPin className="size-8 text-primary" />
								</div>
								<h3 className="font-bold text-foreground mb-2">
									آدرس
								</h3>
								<p className="text-muted-foreground">
									تهران، خیابان ولیعصر
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
}

"use client";

import {
	Phone,
	Mail,
	MapPin,
	ArrowLeft,
	GraduationCap,
	Briefcase,
	Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { Footer } from "@/components/layout";

export default function CVPage() {
	const physiotherapist = {
		name: "دکتر عباس رحیمی",
		title: "فیزیوتراپیست و متخصص توان‌بخشی",
		image: "/images/general/abbas-rahimi.jpg",
		bio: "دکتر عباس رحیمی با بیش از ۱۰ سال تجربه در حوزه فیزیوتراپی و توان‌بخشی، به بیماران کمک می‌کند تا سلامت حرکتی خود را باز یابند و کیفیت زندگی‌شان را بهبود دهند. ایشان در درمان مشکلات عضلانی، اسکلتی و حرکتی با استفاده از روش‌های نوین و تجهیزات پیشرفته تخصص دارد.",
		education: [
			{
				degree: "فیزیوتراپی و توان‌بخشی",
				university: "دانشگاه علوم پزشکی تهران",
				year: "۱۳۹۵",
			},
			{
				degree: "کارشناسی ارشد فیزیوتراپی",
				university: "دانشگاه شهید بهشتی",
				year: "۱۳۹۲",
			},
			{
				degree: "کارشناسی فیزیوتراپی",
				university: "دانشگاه علوم پزشکی ایران",
				year: "۱۳۹۰",
			},
		],
		experience: [
			{
				position: "فیزیوتراپیست ارشد",
				hospital: "کلینیک تخصصی توان‌بخشی تهران",
				years: "۱۳۹۵ - تاکنون",
			},
			{
				position: "فیزیوتراپیست",
				hospital: "بیمارستان امام خمینی تهران",
				years: "۱۳۹۲ - ۱۳۹۵",
			},
		],
		specialties: [
			"توان‌بخشی بعد از جراحی‌های ارتوپدی",
			"درمان مشکلات ستون فقرات و دیسک کمر",
			"تمرین درمانی و ورزش درمانی",
			"فیزیوتراپی کودکان و سالمندان",
			"ماساژ درمانی و درمان دردهای عضلانی",
			"بازتوانی ورزشی",
		],
		contact: {
			phone: "۰۲۱-۹۸۷۶۵۴۳۲",
			email: "dr.rahimi@physioclinic.ir",
			address: "تهران، میدان ونک، کلینیک فیزیوتراپی مرکزی",
		},
	};

	return (
		<div className="min-h-screen bg-background text-foreground" dir="rtl">
			{/* Header Section */}
			<section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/10 via-background to-background relative overflow-hidden">
				<div className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none"></div>
				<div className="container mx-auto relative z-10">
					<div className="flex flex-col md:flex-row items-center md:items-start gap-12">
						<div className="relative size-48 rounded-full overflow-hidden shadow-xl border-4 border-background shrink-0">
							<Image
								src={physiotherapist.image}
								alt={physiotherapist.name}
								fill
								className="object-cover"
								priority
							/>
						</div>
						<div className="text-center md:text-right flex flex-col gap-4">
							<h1 className="text-4xl sm:text-5xl font-bold text-foreground">
								{physiotherapist.name}
							</h1>
							<p className="text-xl sm:text-2xl text-primary font-medium">
								{physiotherapist.title}
							</p>
							<p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto md:mx-0 text-muted-foreground">
								{physiotherapist.bio}
							</p>
							<Button
								asChild
								variant="default"
								className="text-base px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all mt-4 w-fit mx-auto md:mx-0">
								<Link href="/">
									<span>بازگشت به صفحه اصلی</span>
									<ArrowLeft className="me-2 size-5 rtl:rotate-180" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Education Section */}
			<section className="py-20 px-4 bg-background">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							تحصیلات
						</h2>
						<p className="text-xl text-muted-foreground">
							سوابق تحصیلی {physiotherapist.name}
						</p>
					</div>

					<div className="flex flex-col gap-8">
						{physiotherapist.education.map((edu, index) => (
							<div
								key={index}
								className="flex items-start gap-6 border border-border shadow-sm hover:shadow-md transition-shadow bg-card rounded-2xl p-8">
								<div className="size-16 bg-accent rounded-full flex items-center justify-center shrink-0">
									<GraduationCap className="size-8 text-primary" />
								</div>
								<div>
									<h3 className="font-bold text-xl text-foreground mb-1">
										{edu.degree}
									</h3>
									<p className="text-muted-foreground text-lg">
										{edu.university}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										سال فارغ‌التحصیلی: {edu.year}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Experience Section */}
			<section className="py-20 px-4 bg-muted/30 border-y border-border">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							تجربیات کاری
						</h2>
						<p className="text-xl text-muted-foreground">
							مراکز و سوابق حرفه‌ای {physiotherapist.name}
						</p>
					</div>

					<div className="flex flex-col gap-8">
						{physiotherapist.experience.map((exp, index) => (
							<div
								key={index}
								className="flex items-start gap-6 border border-border shadow-sm hover:shadow-md transition-shadow bg-card rounded-2xl p-8">
								<div className="size-16 bg-accent rounded-full flex items-center justify-center shrink-0">
									<Briefcase className="size-8 text-primary" />
								</div>
								<div>
									<h3 className="font-bold text-xl text-foreground mb-1">
										{exp.position}
									</h3>
									<p className="text-muted-foreground text-lg">
										{exp.hospital}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										دوره فعالیت: {exp.years}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Specialties Section */}
			<section className="py-20 px-4 bg-background">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							تخصص‌ها
						</h2>
						<p className="text-xl text-muted-foreground">
							زمینه‌های تخصصی {physiotherapist.name}
						</p>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{physiotherapist.specialties.map((specialty, index) => (
							<div
								key={index}
								className="flex items-center gap-4 border border-border shadow-sm hover:shadow-md transition-shadow bg-card rounded-xl p-6">
								<Award className="size-7 text-primary shrink-0" />
								<p className="text-lg font-medium text-foreground">
									{specialty}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section className="py-20 px-4 bg-muted/30 border-t border-border">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							تماس با {physiotherapist.name}
						</h2>
						<p className="text-xl text-muted-foreground">
							راه‌های ارتباطی با {physiotherapist.name}
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="border border-border shadow-sm text-center hover:shadow-md transition-shadow bg-card rounded-2xl">
							<div className="p-8">
								<div className="size-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
									<Phone className="size-8 text-primary" />
								</div>
								<h3 className="font-bold text-foreground mb-2">
									تلفن
								</h3>
								<p className="text-muted-foreground" dir="ltr">
									{physiotherapist.contact.phone}
								</p>
							</div>
						</div>

						<div className="border border-border shadow-sm text-center hover:shadow-md transition-shadow bg-card rounded-2xl">
							<div className="p-8">
								<div className="size-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
									<Mail className="size-8 text-primary" />
								</div>
								<h3 className="font-bold text-foreground mb-2">
									ایمیل
								</h3>
								<p className="text-muted-foreground" dir="ltr">
									{physiotherapist.contact.email}
								</p>
							</div>
						</div>

						<div className="border border-border shadow-sm text-center hover:shadow-md transition-shadow bg-card rounded-2xl">
							<div className="p-8">
								<div className="size-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
									<MapPin className="size-8 text-primary" />
								</div>
								<h3 className="font-bold text-foreground mb-2">
									آدرس مطب
								</h3>
								<p className="text-muted-foreground">
									{physiotherapist.contact.address}
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

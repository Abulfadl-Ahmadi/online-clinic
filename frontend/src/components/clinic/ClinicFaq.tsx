"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const faqs = [
	{
		question: "برای شروع فیزیوتراپی چه اقدامی لازم است؟",
		answer:
			"پس از ویزیت پزشک معالج و در صورت توصیه به فیزیوتراپی، برای هماهنگی وقت با کلینیک تماس بگیرید. در شروع مراجعه، شرح‌حال، بیماری‌های زمینه‌ای، موارد احتیاطی و وضعیت حرکت شما بررسی می‌شود تا برنامهٔ درمانی مناسب تعیین شود.",
	},
	{
		question: "فیزیوتراپی چیست و چه کمکی می‌کند؟",
		answer: "فیزیوتراپی یکی از روش‌های غیرتهاجمی مراقبت و توان‌بخشی است. فیزیوتراپیست با ارزیابی وضعیت فرد و استفاده از تمرین‌درمانی، درمان دستی، روش‌های فیزیکی و آموزش، به بهبود حرکت و عملکرد، کاهش درد و پیشگیری از آسیب کمک می‌کند. برنامهٔ درمان برای هر فرد جداگانه تعیین می‌شود.",
	},
	{
		question: "ساعات مراجعهٔ کلینیک چگونه است؟",
		answer:
			"شنبه تا چهارشنبه از ساعت ۸ تا ۱۲ و ۱۵ تا ۲۰، و پنجشنبه‌ها از ساعت ۸ تا ۱۲. برای اطمینان از زمان آزاد و هماهنگی نوبت، پیش از مراجعه تماس بگیرید.",
	},
	{
		question: "کلینیک چه خدماتی ارائه می‌دهد؟",
		answer:
			"برنامهٔ درمان با توجه به ارزیابی هر فرد می‌تواند شامل تمرین‌درمانی، درمان دستی، الکتروتراپی، لیزر کم‌توان و پرتوان، شاک‌ویو، تکار، مگنت، APS، وازوترین، درای‌نیدلینگ و بیوفیدبک در موارد مرتبط باشد. انتخاب روش درمانی به تشخیص فیزیوتراپیست و نیاز درمانی شما بستگی دارد.",
	},
	{
		question: "تمرین‌های خانگی چه نقشی در درمان دارند؟",
		answer: "برنامهٔ درمان فقط به جلسات کلینیک محدود نیست. تمرین‌هایی که در مرکز آموزش می‌بینید، باید مطابق راهنمایی فیزیوتراپیست و با رعایت احتیاط در خانه تکرار شوند؛ انجام درست تمرین و نکات مراقبتی در خانه و محل کار بخشی مهم از مسیر درمان است.",
	},
	{
		question: "آیا امکان مراجعه با مترو یا خودرو شخصی وجود دارد؟",
		answer:
			"ایستگاه متروی نیروی هوایی حدود ۱۵۰ متر با کلینیک فاصله دارد. برای مراجعه با خودرو، معمولاً در اطراف مطب و کوچه‌های پشت خیابان سوم و چهارم نیروی هوایی امکان پارک وجود دارد؛ پارکینگ عمومی پشت مترو نیز در فاصلهٔ حدود ۱۵۰ متری فعال است.",
	},
	{
		question: "آیا برای بررسی کف پا، زانو و ستون فقرات باید وقت بگیرم؟",
		answer: "فیزیوتراپیست برای بررسی مشکلات کف پا، زانو و ستون فقرات، در صورت نیاز از اسکن کف پا و آنالیز ستون فقرات و اندام‌ها کمک می‌گیرد. این ارزیابی‌ها به معاینهٔ دقیق‌تر و انتخاب برنامهٔ درمانی مناسب برای دفورمیتی‌ها (ناهنجاری‌های ساختاری) کمک می‌کنند؛ تصمیم درمانی بر اساس مجموع یافته‌های معاینه است، نه اسکن به‌تنهایی. برای اطلاع از زمان‌های فعال و هماهنگی مراجعه، با پذیرش تماس بگیرید.",
	},
	{
		question: "آیا فیزیوتراپی در منزل هم انجام می‌شود؟",
		answer:
			"برای بیمارانی که امکان حضور در کلینیک ندارند، امکان بررسی درخواست فیزیوتراپی در منزل از طریق تماس با کلینیک وجود دارد. این خدمت به‌ویژه برای برخی بیماران ارتوپدی و نورولوژیک مانند سکتهٔ مغزی، ام‌اس، پارکینسون و ضایعات نخاعی قابل بررسی است؛ هماهنگی نهایی بر اساس وضعیت بیمار و ظرفیت خدمات انجام می‌شود.",
	},
];

export function ClinicFaq() {
	const baseId = useId();
	const [openIndex, setOpenIndex] = useState<number | null>(0);
	const reduceMotion = useReducedMotion();

	return (
		<section className="brand-soft-section px-4 py-20 sm:py-24" aria-labelledby="faq-title">
			<div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
				<div>
					<p className="brand-overline">پیش از مراجعه</p>
					<h2 id="faq-title" className="mt-3 text-3xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-4xl">
						پاسخ به پرسش‌های رایج شما
					</h2>
					<p className="mt-5 leading-8 text-[var(--brand-muted)]">
						اگر پاسخ پرسش‌تان اینجا نیست، در ساعات کاری با کلینیک تماس بگیرید تا همکاران ما راهنمایی کنند.
					</p>
				</div>
				<div className="brand-card rounded-[1.5rem] px-6 sm:px-8">
					{faqs.map((faq, index) => {
						const isOpen = openIndex === index;
						const panelId = `${baseId}-panel-${index}`;

						return (
							<div key={faq.question} className="border-b border-[color:var(--brand-line)] last:border-b-0">
								<h3>
									<button
										type="button"
										className="brand-link-ring flex w-full items-center justify-between gap-5 py-5 text-start font-bold text-[var(--brand-ink)]"
										aria-expanded={isOpen}
										aria-controls={panelId}
										onClick={() => setOpenIndex(isOpen ? null : index)}>
										{faq.question}
										<ChevronDown className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
									</button>
								</h3>
								<AnimatePresence initial={false}>
									{isOpen && <motion.div
										key={panelId}
										id={panelId}
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: reduceMotion ? 0 : 0.25 }}
										className="overflow-hidden leading-8 text-[var(--brand-muted)]">
										<p className="pb-5">{faq.answer}</p>
									</motion.div>}
								</AnimatePresence>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

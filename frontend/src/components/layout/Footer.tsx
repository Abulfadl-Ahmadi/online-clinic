import Link from "next/link";
import { Activity, Clock3, MapPin, Phone } from "lucide-react";

function Footer() {
	return (
		<footer className="brand-dark-section text-white py-14 px-4" dir="rtl">
			<div className="container mx-auto max-w-7xl">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					<div>
						<div className="flex items-center gap-2 mb-4">
							<div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
								<Activity className="size-6 text-white" />
							</div>
							<span className="text-xl font-bold">
								کلینیک فیزیوتراپی دکتر رحیمی
							</span>
						</div>
						<p className="text-white/70 leading-7">
							بازگشت به حرکت، با پشتوانهٔ علم و توان‌بخشی مبتنی بر شواهد.
						</p>
					</div>

					<div>
						<h3 className="font-bold mb-4">خدمات</h3>
						<ul className="flex flex-col gap-2 text-white/70">
							<li>
								<Link
									href="/#services"
									className="hover:text-white transition-colors">
									فیزیوتراپی و توان‌بخشی
								</Link>
							</li>
							<li>
								<Link
									href="/#treatment-path"
									className="hover:text-white transition-colors">
									مسیر درمان
								</Link>
							</li>
							<li>
								<Link
									href="/clinic"
									className="hover:text-white transition-colors">
									معرفی کلینیک
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold mb-4">کلینیک</h3>
						<ul className="flex flex-col gap-2 text-white/70">
							<li>
								<Link
									href="/about-us"
									className="hover:text-white transition-colors">
									دکتر عباس رحیمی
								</Link>
							</li>
							<li>
								<Link
									href="/clinic"
									className="hover:text-white transition-colors">
									فضای کلینیک
								</Link>
							</li>
							<li>
								<Link
									href="/articles"
									className="hover:text-white transition-colors">
									مقالات و اخبار
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4 text-white/75">
						<div className="flex flex-wrap items-start gap-3">
							<Phone className="size-5 shrink-0 mt-0.5 text-[#9fd4cc]" />
							<a href="tel:02177402528" dir="ltr" className="whitespace-nowrap hover:text-white transition-colors">021-77402528</a>
							<a href="tel:02177466628" dir="ltr" className="hover:text-white transition-colors">021 7746 6628</a>
						</div>
						<div className="flex items-start gap-3">
							<Clock3 className="size-5 shrink-0 mt-0.5 text-[#9fd4cc]" />
							<span>شنبه تا چهارشنبه ۸ تا ۱۲ و ۱۵ تا ۲۰<br />پنجشنبه ۸ تا ۱۲</span>
						</div>
						<div className="flex items-start gap-3">
							<MapPin className="size-5 shrink-0 mt-0.5 text-[#9fd4cc]" />
							<span>تهران، خیابان پیروزی، ساختمان پزشکان ادیب</span>
						</div>
					</div>
				</div>

				<div className="border-t border-white/15 pt-8 text-center text-white/55 text-sm">
					<p>© ۱۴۰۵ کلینیک فیزیوتراپی دکتر عباس رحیمی. تمامی حقوق محفوظ است.</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;

import { Shield } from "lucide-react";

function Footer() {
	return (
		<footer className="bg-muted/40 border-t border-border text-foreground py-12 px-4">
			<div className="container mx-auto">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					<div>
						<div className="flex items-center gap-2 mb-4">
							<div className="size-10 bg-primary rounded-lg flex items-center justify-center">
								<Shield className="size-6 text-primary-foreground" />
							</div>
							<span className="text-xl font-bold">
								کلینیک آنلاین
							</span>
						</div>
						<p className="text-muted-foreground">
							سلامتی شما، اولویت ماست
						</p>
					</div>

					<div>
						<h3 className="font-bold mb-4 text-foreground">خدمات</h3>
						<ul className="flex flex-col gap-2 text-muted-foreground">
							<li>
								<a
									href="/#features"
									className="hover:text-primary transition-colors">
									مشاوره آنلاین
								</a>
							</li>
							<li>
								<a
									href="/#booking"
									className="hover:text-primary transition-colors">
									نوبت‌دهی آنلاین
								</a>
							</li>
							<li>
								<a
									href="/#doctors"
									className="hover:text-primary transition-colors">
									پزشکان متخصص
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold mb-4 text-foreground">شرکت</h3>
						<ul className="flex flex-col gap-2 text-muted-foreground">
							<li>
								<a
									href="/about-us"
									className="hover:text-primary transition-colors">
									درباره ما
								</a>
							</li>
							<li>
								<a
									href="/cv"
									className="hover:text-primary transition-colors">
									رزومه پزشک
								</a>
							</li>
							<li>
								<a
									href="/articles"
									className="hover:text-primary transition-colors">
									مقالات و اخبار
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold mb-4 text-foreground">قوانین و راهنما</h3>
						<ul className="flex flex-col gap-2 text-muted-foreground">
							<li>
								<a
									href="#"
									className="hover:text-primary transition-colors">
									حریم خصوصی
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-primary transition-colors">
									شرایط استفاده
								</a>
							</li>
							<li>
								<a
									href="/#faq"
									className="hover:text-primary transition-colors">
									سوالات متداول
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
					<p>© ۱۴۰۴ کلینیک آنلاین. تمامی حقوق محفوظ است.</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;

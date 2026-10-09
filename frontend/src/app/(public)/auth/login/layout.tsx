import type { Metadata } from "next";
import { Fragment, PropsWithChildren } from "react";

import { getSession } from "@/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import ThemeSwitcher from "@/components/preferences/ThemeSwitcher";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "ورود",
		description: "ورود برای درخواست و پیگیری نوبت در کلینیک فیزیوتراپی دکتر عباس رحیمی",
	};
}

async function LoginLayout({ children }: Readonly<PropsWithChildren>) {
	const { accessToken, userPayload } = await getSession();

	if (accessToken && userPayload) {
		redirect("/user/dashboard");
	}

	return <Fragment><a href="#main-content" className="brand-skip-link">پرش به فرم ورود</a><header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 px-4 py-4 sm:px-8"><Link href="/" className="font-bold text-foreground hover:text-primary">کلینیک فیزیوتراپی دکتر رحیمی</Link><ThemeSwitcher /></header><main id="main-content" tabIndex={-1} className="flex-1">{children}</main></Fragment>;
}

export default LoginLayout;

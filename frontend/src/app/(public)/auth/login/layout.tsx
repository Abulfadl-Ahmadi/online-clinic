import type { Metadata } from "next";
import { Fragment, PropsWithChildren } from "react";

import { getSession } from "@/actions";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "ورود",
		description: "ورود به کلینیک آنلاین",
	};
}

async function LoginLayout({ children }: Readonly<PropsWithChildren>) {
	const { accessToken, userPayload } = await getSession();

	if (accessToken && userPayload) {
		redirect("/user/dashboard");
	}

	return <Fragment>{children}</Fragment>;
}

export default LoginLayout;

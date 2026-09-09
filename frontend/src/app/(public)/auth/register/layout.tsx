import type { Metadata } from "next";
import { Fragment, PropsWithChildren } from "react";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "ثبت نام",
		description: "ثبت نام در کلینک آنلاین",
	};
}

function RegisterLayout({ children }: Readonly<PropsWithChildren>) {
	return <Fragment>{children}</Fragment>;
}

export default RegisterLayout;

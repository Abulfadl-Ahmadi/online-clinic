import type { Metadata } from "next";
import { Fragment, PropsWithChildren } from "react";

import { NavManager } from "@/components/layout";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "رزومه",
		description: "رزومه کلینک آنلاین",
	};
}

function CVLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<Fragment>
			<NavManager />
			<main className="flex-1">{children}</main>
		</Fragment>
	);
}

export default CVLayout;

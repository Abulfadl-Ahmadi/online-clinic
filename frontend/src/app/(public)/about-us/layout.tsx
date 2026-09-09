import type { Metadata } from "next";
import { Fragment, PropsWithChildren } from "react";

import { NavManager } from "@/components/layout";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "درباره ما",
		description: "درباره کلینک آنلاین",
	};
}

function AboutUsLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<Fragment>
			<NavManager />
			<main className="flex-1">{children}</main>
		</Fragment>
	);
}

export default AboutUsLayout;

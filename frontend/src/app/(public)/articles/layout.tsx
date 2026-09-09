import type { Metadata } from "next";
import { Fragment, PropsWithChildren } from "react";

import { NavManager } from "@/components/layout";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "مقالات",
		description: "مقالات کلینک آنلاین",
	};
}

function ArticleLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<Fragment>
			<NavManager />
			<main className="flex-1 app-px py-8">{children}</main>
		</Fragment>
	);
}

export default ArticleLayout;

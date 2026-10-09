import type { Metadata } from "next";
import { Fragment, PropsWithChildren } from "react";

import { NavManager } from "@/components/layout";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "مقالات و راهنماهای توان‌بخشی",
		description: "مقاله‌ها و راهنماهای آموزشی کلینیک فیزیوتراپی دکتر عباس رحیمی دربارهٔ حرکت، توان‌بخشی و پیشگیری از آسیب.",
	};
}

function ArticleLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<Fragment>
			<NavManager />
			<main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
		</Fragment>
	);
}

export default ArticleLayout;

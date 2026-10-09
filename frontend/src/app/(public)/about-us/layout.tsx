import type { Metadata } from "next";
import { Fragment, PropsWithChildren } from "react";

import { NavManager } from "@/components/layout";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "دکتر عباس رحیمی | فیزیوتراپیست و متخصص توان‌بخشی",
		description: "معرفی سوابق علمی و حرفه‌ای دکتر عباس رحیمی، فیزیوتراپیست و مدیر کلینیک فیزیوتراپی دکتر رحیمی در تهران.",
	};
}

function AboutUsLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<Fragment>
			<NavManager />
			<main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
		</Fragment>
	);
}

export default AboutUsLayout;

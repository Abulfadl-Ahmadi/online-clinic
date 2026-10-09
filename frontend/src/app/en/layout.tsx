import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { EnglishPublicLayout } from "@/components/layout/EnglishPublicLayout";

export const metadata: Metadata = {
	title: {
		default: "Dr. Abbas Rahimi Physiotherapy Clinic",
		template: "%s | Dr. Abbas Rahimi Physiotherapy Clinic",
	},
	description: "Evidence-informed physiotherapy and rehabilitation in Tehran, Iran.",
	alternates: {
		languages: { fa: "/", en: "/en" },
	},
	openGraph: {
		locale: "en_US",
		alternateLocale: "fa_IR",
		title: "Dr. Abbas Rahimi Physiotherapy Clinic",
		description: "Return to movement, backed by science.",
		images: [{ url: "/images/brand/dr-abbas-rahimi-hero.png", width: 1672, height: 941, alt: "Dr. Abbas Rahimi at the clinic" }],
	},
};

export default function EnglishLayout({ children }: PropsWithChildren) {
	return <EnglishPublicLayout>{children}</EnglishPublicLayout>;
}

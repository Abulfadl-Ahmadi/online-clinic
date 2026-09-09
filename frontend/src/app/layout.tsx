import "../assets/styles/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { PropsWithChildren } from "react";

import { Toaster } from "@/components/ui";
import { ThemeProvider, UserProvider } from "@/context";

const peyda = localFont({
	src: [
		{
			weight: "100",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-Thin.woff2",
		},
		{
			weight: "200",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-ExtraLight.woff2",
		},
		{
			weight: "300",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-Light.woff2",
		},
		{
			weight: "400",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-Regular.woff2",
		},
		{
			weight: "500",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-Medium.woff2",
		},
		{
			weight: "600",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-SemiBold.woff2",
		},
		{
			weight: "700",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-Bold.woff2",
		},
		{
			weight: "800",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-ExtraBold.woff2",
		},
		{
			weight: "900",
			style: "normal",
			path: "../assets/fonts/Peyda/woff2/PeydaWebFaNum-Black.woff2",
		},
	],
	variable: "--font-peyda",
});

const iranYekanX = localFont({
	src: [
		{
			weight: "normal",
			style: "normal",
			path: "../assets/fonts/IRANYekanX/IRANYekanX-Regular.woff",
		},
		{
			weight: "bold",
			style: "normal",
			path: "../assets/fonts/IRANYekanX/IRANYekanX-Bold.woff",
		},
	],
	variable: "--font-iran-yekan-x",
});

export async function generateMetadata(): Promise<Metadata> {
	return {
		applicationName: "Online Clinic",
		title: {
			default: "کلینک آنلاین",
			template: "کلینک آنلاین | %s",
		},
	};
}

async function RootLayout({ children }: Readonly<PropsWithChildren>) {
	const locale = "fa-IR";
	const dir = "rtl";

	return (
		<html lang={locale} suppressHydrationWarning dir={dir}>
			<body
				dir={dir}
				// ${geistSans.variable} ${geistMono.variable}
				className={`${peyda.variable} ${iranYekanX.variable} 
					antialiased bg-background
                    flex flex-col min-h-dvh
                    !font-iran-yekan-x ss02`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem>
					<UserProvider>{children}</UserProvider>
					<Toaster position="top-center" dir={dir} />
				</ThemeProvider>
			</body>
		</html>
	);
}

export default RootLayout;

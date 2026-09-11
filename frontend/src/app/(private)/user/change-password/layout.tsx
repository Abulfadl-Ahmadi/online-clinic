import type { Metadata } from "next";
import { PropsWithChildren } from "react";

import { SidebarProvider } from "@/components/ui";
import { PanelSidebar } from "@/components/layout/sidebar";
import { PanelNavbar } from "@/components/layout/navbar";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "تغییر رمز عبور",
		description: "تغییر رمز عبور کاربر در کلینیک آنلاین",
	};
}

function ChangePasswordLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<SidebarProvider>
			<PanelSidebar />
			<div className="w-full">
				<PanelNavbar />
				<main className="w-full h-[94dvh] p-4 overflow-y-auto">
					{children}
				</main>
			</div>
		</SidebarProvider>
	);
}

export default ChangePasswordLayout;

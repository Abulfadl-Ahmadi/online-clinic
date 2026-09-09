import type { Metadata } from "next";
import { PropsWithChildren } from "react";

import { SidebarProvider } from "@/components/ui";
import { PanelNavbar } from "@/components/layout/navbar";
import { PanelSidebar } from "@/components/layout/sidebar";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "دکتر ها",
		description: "دکتر های کاربر کلینیک آنلاین",
	};
}

function DoctorsLayout({ children }: Readonly<PropsWithChildren>) {
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

export default DoctorsLayout;

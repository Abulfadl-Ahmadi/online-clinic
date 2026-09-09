"use client";

import { useState } from "react";

import NavMenuButton from "./NavMenuButton";
import { LogoType } from "@/components/common";
import PanelSidebarSheet from "../sidebar/PanelSidebarSheet";
import { ThemeSwitcher } from "@/components/preferences";

function PanelNavbar() {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	function handleSidebarStatus(isOpen: boolean) {
		setIsSidebarOpen(isOpen);
	}

	return (
		<nav
			className="bg-card/95 sticky top-0 z-10 
			border-b border-border py-4 px-4 md:px-6 h-14 backdrop-blur-2xl
        	flex items-center justify-between gap-4">
			<LogoType />

			<div className="hidden md:block">
				<ThemeSwitcher />
			</div>

			<div className="block md:hidden">
				<NavMenuButton onClick={() => handleSidebarStatus(true)} />
			</div>

			<PanelSidebarSheet
				side="right"
				fullWidth={false}
				isOpen={isSidebarOpen}
				onClose={() => handleSidebarStatus(false)}
			/>
		</nav>
	);
}

export default PanelNavbar;

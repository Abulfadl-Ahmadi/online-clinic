"use client";

import SidebarHeader from "./SidebarHeader";
import SidebarLinks from "./SidebarLinks";
import { AppVersion } from "@/components/ui";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	fullWidth?: boolean;
	side?: "left" | "right";
}

/** Radix Sheet manages focus, Escape, the backdrop and focus restoration. */
const PanelSidebarSheet = ({ isOpen, onClose, fullWidth, side = "right" }: SidebarProps) => (
	<Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
		<SheetContent side={side} aria-describedby={undefined} className={`overflow-y-auto bg-sidebar p-4 md:hidden ${fullWidth ? "w-full max-w-none" : "w-[min(85vw,22rem)] sm:max-w-sm"}`}>
			<SheetTitle className="sr-only">فهرست راهبری پنل</SheetTitle>
			<SidebarHeader side={side} onClose={onClose} />
			<SidebarLinks isPanel onClick={onClose} />
			<AppVersion className="mt-auto pt-6 text-center" />
		</SheetContent>
	</Sheet>
);

export default PanelSidebarSheet;

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

/** Public mobile navigation uses the existing accessible Radix Sheet. */
const Sidebar = ({ isOpen, onClose, fullWidth, side = "right" }: SidebarProps) => (
	<Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
		<SheetContent side={side} aria-describedby={undefined} className={`overflow-y-auto bg-sidebar p-4 sm:hidden ${fullWidth ? "w-full max-w-none" : "w-[min(85vw,22rem)]"}`}>
			<SheetTitle className="sr-only">فهرست راهبری سایت</SheetTitle>
			<SidebarHeader side={side} onClose={onClose} />
			<SidebarLinks onClick={onClose} />
			<AppVersion className="mt-auto pt-6 text-center" />
		</SheetContent>
	</Sheet>
);

export default Sidebar;

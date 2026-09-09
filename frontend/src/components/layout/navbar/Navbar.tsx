"use client";

import NavLinks from "./NavLinks";
import NavMenuButton from "./NavMenuButton";
import { UserMenu } from "@/components/user";
import { LogoType } from "@/components/common";
import { Shield } from "lucide-react";

interface Props {
	onOpenSidebar: () => void;
}

function Navbar(props: Props) {
	return (
		<nav
			className="bg-background/90 border-b border-border/60 sticky top-0 z-50 backdrop-blur-2xl app-px py-4 flex items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<div className="size-9 bg-primary rounded-lg flex items-center justify-center">
					<Shield className="text-primary-foreground size-5" />
				</div>
				<LogoType />
			</div>
			<div className="hidden sm:block">
				<NavLinks />
			</div>
			<div className="hidden sm:flex justify-end">
				<UserMenu />
			</div>
			<div className="block sm:hidden">
				<NavMenuButton onClick={props.onOpenSidebar} />
			</div>
		</nav>
	);
}

export default Navbar;

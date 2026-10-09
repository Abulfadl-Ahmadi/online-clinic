"use client";

import { LocaleSwitchLink } from "../LocaleSwitchLink";
import NavLinks from "./NavLinks";
import NavMenuButton from "./NavMenuButton";
import { UserMenu } from "@/components/user";
import ThemeSwitcher from "@/components/preferences/ThemeSwitcher";
import { LogoType } from "@/components/common";
import { Activity } from "lucide-react";

interface Props {
	onOpenSidebar: () => void;
}

function Navbar(props: Props) {
	return (
		<>
		<a href="#main-content" className="brand-skip-link" lang="fa">پرش به محتوای اصلی</a>
		<nav
			className="bg-background/90 border-b border-border/60 sticky top-0 z-50 backdrop-blur-2xl app-px py-3 flex items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<div className="size-10 bg-[#123e46] dark:bg-[#b8ded7] rounded-xl flex items-center justify-center shadow-sm">
					<Activity className="text-white dark:text-[#09252b] size-5" />
				</div>
				<LogoType />
			</div>
			<div className="hidden sm:block">
				<NavLinks />
			</div>
			<div className="hidden sm:flex items-center justify-end gap-4">
				<ThemeSwitcher />
				<LocaleSwitchLink target="en" className="brand-link-ring inline-flex min-h-11 items-center text-sm font-bold text-foreground hover:text-primary" />
				<UserMenu />
			</div>
			<div className="flex items-center gap-2 sm:hidden">
				<ThemeSwitcher />
				<NavMenuButton onClick={props.onOpenSidebar} />
			</div>
		</nav>
		</>
	);
}

export default Navbar;

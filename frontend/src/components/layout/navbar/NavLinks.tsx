"use client";

import NavLink from "./NavLink";
import { usePathname } from "next/navigation";
import { publicLinks } from "@/constants";
import { cn, isLinkActive } from "@/lib/utils";

interface NavigationLinksProps {
	className?: string;
}

function NavLinks(props: NavigationLinksProps) {
	const pathname = usePathname();

	return (
		<div
			className={cn(
				"flex items-center justify-center gap-5",
				props.className,
			)}>
			{publicLinks.map((link, index) => (
				<NavLink
					key={index}
					href={link.href}
					isActive={isLinkActive(pathname, link.href)}>
					{link.label}
				</NavLink>
			))}
		</div>
	);
}

export default NavLinks;

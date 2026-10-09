"use client";

import { LocaleSwitchLink } from "../LocaleSwitchLink";
import { Globe2 } from "lucide-react";
import { useUser } from "@/context";
import SidebarLink from "./SidebarLink";
import { usePathname } from "next/navigation";
import { cn, isLinkActive } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { adminLinks, userLinks, publicLinks, doctorLinks } from "@/constants";

interface Props {
	className?: string;
	onClick?: () => void;
	isPanel?: boolean;
}

const SidebarLinks = (props: Props) => {
	const pathname = usePathname();
	const { userRole: useRole } = useUser();

	const handleClick = () => {
		props.onClick?.();
	};

	const containerVariants: Variants = {
		hidden: {
			opacity: 0,
		},

		visible: {
			opacity: 1,
			transition: {
				// type: "ease",
				delayChildren: 0.2,
				staggerChildren: 0.15,
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className={cn("flex flex-col gap-4 w-full", props.className)}>
			{props.isPanel &&
				useRole !== "doctor" &&
				userLinks.map((link, index) => (
					<SidebarLink
						key={index}
						href={link.href}
						isActive={isLinkActive(pathname, link.href)}
						onClick={handleClick}>
						{link.label}
					</SidebarLink>
				))}

			{props.isPanel &&
				useRole === "doctor" &&
				doctorLinks.map((link, index) => (
					<SidebarLink
						key={index}
						href={link.href}
						isActive={isLinkActive(pathname, link.href)}
						onClick={handleClick}>
						{link.label}
					</SidebarLink>
				))}

			{props.isPanel &&
				useRole === "admin" &&
				adminLinks.map((link, index) => (
					<SidebarLink
						key={index}
						href={link.href}
						isActive={isLinkActive(pathname, link.href)}
						onClick={handleClick}>
						{link.label}
					</SidebarLink>
				))}

			{publicLinks.map((link, index) => (
				<SidebarLink
					key={index}
					href={link.href}
					isActive={isLinkActive(pathname, link.href)}
					onClick={handleClick}>
					{link.label}
				</SidebarLink>
			))}
			<div className="flex items-center gap-2 rounded-md px-4 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"><Globe2 aria-hidden="true" className="size-4" /><LocaleSwitchLink target="en" onClick={handleClick} className="flex min-h-11 flex-1 items-center" /></div>
		</motion.div>
	);
};

export default SidebarLinks;

"use client";

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
		</motion.div>
	);
};

export default SidebarLinks;

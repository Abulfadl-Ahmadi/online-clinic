"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface Props {
	href: string;
	isActive: boolean;
	children?: React.ReactNode;
	onClick?: () => void;
}

const SidebarLink = (props: Props) => {
	const itemVariants: Variants = {
		hidden: {
			y: 30,
			opacity: 0,
		},
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				damping: 20,
				type: "spring",
				stiffness: 200,
				duration: 0.15,
			},
		},
	};

	const activeClass = props.isActive
		? `text-primary bg-accent border-primary px-2 rounded-r-none border-r-2`
		: "text-muted-foreground hover:text-primary hover:bg-accent border-transparent px-4";

	return (
		<motion.div
			variants={itemVariants}
			className="flex items-center w-full">
			<Link
				href={props.href as "/"}
				onClick={props.onClick}
				className={`rounded-md transition-colors w-full py-2 ${activeClass}`}>
				{props.children}
			</Link>
		</motion.div>
	);
};

export default SidebarLink;

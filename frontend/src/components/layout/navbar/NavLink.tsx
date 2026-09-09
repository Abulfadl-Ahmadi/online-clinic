import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavLinkProps {
	href: string;
	isActive: boolean;
	className?: string;
	children?: React.ReactNode;
}

const NavLink = (props: NavLinkProps) => {
	return (
		<div className={cn("relative", props.className)}>
			<Link
				href={props.href as "/"}
				className={`transition-colors hover:text-primary text-nowrap ${
					props.isActive ? "text-primary" : `text-muted-foreground`
				}`}>
				{props.children}
			</Link>

			{props.isActive && (
				<motion.span
					layoutId="drd-navlink"
					className={`bg-primary absolute block rounded-2xl h-0.5 w-full top-6`}
				/>
			)}
		</div>
	);
};

export default NavLink;

"use client";

import SidebarHeader from "./SidebarHeader";
import SidebarLinks from "./SidebarLinks";
import { useClickOutside } from "@/hooks";
import { AppVersion } from "@/components/ui";
import { AnimatePresence, motion, Variants } from "framer-motion";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	fullWidth?: boolean;
	side?: "left" | "right";
}

const PanelSidebarSheet = (props: SidebarProps) => {
	const side = props.side || "right";

	// Attach the click-outside hook to the wrapper element
	const sidebarRef = useClickOutside<HTMLDivElement>(props.onClose);

	const containerVariants: Variants = {
		initial: {
			x: props.side === "left" ? "-100%" : "100%",
			opacity: 0,
		},

		visible: {
			x: 0,
			opacity: 1,
			transition: {
				// type: "ease",
				duration: 0.35,
				delayChildren: 0.2,
				staggerChildren: 0.15,
			},
		},
		exit: {
			x: props.side === "left" ? "-100%" : "100%",
			opacity: 0,
			transition: {
				duration: 0.35,
				// type: "ease-in-out",
			},
		},
	};

	return (
		<AnimatePresence>
			{props.isOpen && (
				<>
					{!props.fullWidth && (
						<motion.div
							className={`fixed top-0 left-0 right-0 bottom-0 bg-black/75 backdrop-blur-lg z-10`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						/>
					)}
					<motion.aside
						ref={sidebarRef}
						variants={containerVariants}
						initial="initial"
						animate="visible"
						exit="exit"
						className={`fixed top-0 sm:hidden
                        flex flex-col items-center gap-10 p-4 z-50 h-dvh                        
                        bg-sidebar
                        ${side === "left" ? "left-0" : "right-0"}  ${
							props.fullWidth ? "w-full" : "min-w-[60dvw]"
						}`}>
						<SidebarHeader side={"left"} onClose={props.onClose} />

						<SidebarLinks isPanel onClick={props.onClose} />

						<AppVersion className="absolute bottom-2" />
					</motion.aside>
				</>
			)}
		</AnimatePresence>
	);
};

export default PanelSidebarSheet;

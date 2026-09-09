"use client";

import { XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { UserMenu } from "@/components/user";

interface Props {
	side: "left" | "right";
	onClose: () => void;
}

const SidebarHeader = (props: Props) => {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			exit="hidden"
			className="flex w-full items-center justify-between gap-2 p-1">
			<div className="flex-1 min-w-0">
				<UserMenu showName={true} />
			</div>

			<Button
				size={"icon"}
				variant={"ghost"}
				onClick={props.onClose}
				className="p-0 shrink-0">
				<XIcon className="text-muted-foreground size-6" />
			</Button>
		</motion.div>
	);
};

export default SidebarHeader;

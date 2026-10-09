"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui";

interface Props {
	onClick?: () => void;
}

function NavMenuButton(props: Props) {
	return (
		<div>
			<Button
				onClick={props.onClick}
				variant={"outline"}
				aria-label="باز کردن فهرست راهبری"
				className="size-11"
				size={"icon"}>
				<MenuIcon />
			</Button>
		</div>
	);
}

export default NavMenuButton;

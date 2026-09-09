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
				className="aspect-square"
				size={"icon-sm"}>
				<MenuIcon />
			</Button>
		</div>
	);
}

export default NavMenuButton;

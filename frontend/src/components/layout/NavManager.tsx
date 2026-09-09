"use client";

import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Fragment, useState } from "react";

const Navigation = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	function handleSidebarStatus(isOpen: boolean) {
		setIsSidebarOpen(isOpen);
	}

	return (
		<Fragment>
			<Navbar onOpenSidebar={() => handleSidebarStatus(true)} />

			<Sidebar
				side="right"
				fullWidth={false}
				isOpen={isSidebarOpen}
				onClose={() => handleSidebarStatus(false)}
			/>
		</Fragment>
	);
};

export default Navigation;

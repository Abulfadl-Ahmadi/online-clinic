import { Fragment, PropsWithChildren } from "react";

import { NavManager } from "@/components/layout";

function HomeLayout({ children }: PropsWithChildren) {
	return (
		<Fragment>
			<NavManager />
			<main className="flex-1">{children}</main>
		</Fragment>
	);
}

export default HomeLayout;

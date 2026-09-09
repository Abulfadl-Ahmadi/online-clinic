import { Fragment, PropsWithChildren } from "react";

import { NavManager } from "@/components/layout";

function ClinicLayout({ children }: PropsWithChildren) {
	return (
		<Fragment>
			<NavManager />
			<main className="flex-1">{children}</main>
		</Fragment>
	);
}

export default ClinicLayout;

"use client";

import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks";
import { LucideLogOut } from "lucide-react";
import { Button, Spinner } from "@/components/ui";

interface Props {
	withAnimation?: boolean;
}

function LogoutAction({ withAnimation = true }: Props) {
	const { handleLogout, isLoading } = useLogout();

	return (
		<Button
			size="icon-sm"
			onClick={handleLogout}
			variant="outline"
			disabled={isLoading}
			className={cn(
				"group flex items-center gap-2 aspect-square size-[34px] overflow-hidden rounded-full border border-border text-sm font-medium justify-start px-2 py-1.5",
				withAnimation
					? "hover:w-[90px] transition-all duration-300 ease-in-out hover:border-destructive/30 hover:bg-destructive/10"
					: "w-[34px]",
			)}>
			{isLoading ? (
				<Spinner className="size-4 text-destructive shrink-0" />
			) : (
				<LucideLogOut
					className={cn(
						"size-4 text-destructive shrink-0",
						withAnimation &&
							"transition-transform duration-300 group-hover:-rotate-12",
					)}
				/>
			)}
			{withAnimation && (
				<span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap text-foreground">
					خروج
				</span>
			)}
		</Button>
	);
}

export default LogoutAction;

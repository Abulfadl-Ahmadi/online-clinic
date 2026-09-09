"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUser } from "@/context";
import { useLogout } from "@/hooks";
import { LogOutIcon } from "lucide-react";
import { isLinkActive } from "@/lib/utils";
import { UserMenu } from "@/components/user";
import { adminLinks, userLinks, publicLinks, doctorLinks } from "@/constants";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui";

function PanelSidebar() {
	const pathname = usePathname();
	const { userRole } = useUser();
	const { handleLogout } = useLogout();

	return (
		<Sidebar side="right" collapsible="icon">
			<div
				className="bg-sidebar absolute -left-4 top-1/2 -translate-y-1/2
					rounded-lg border size-8 flex items-center justify-center z-10">
				<SidebarTrigger className="size-full" />
			</div>

			<SidebarHeader className="p-2 border-b border-sidebar-border">
				<UserMenu showName={true} />
			</SidebarHeader>

			<SidebarContent>
				{userRole !== "doctor" && (
					<SidebarGroup>
						<SidebarGroupLabel>پنل کاربری</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{userLinks.map((item, index) => (
									<SidebarMenuItem key={index}>
										<SidebarMenuButton
											asChild
											isActive={isLinkActive(
												pathname,
												item.href,
											)}>
											<Link href={item.href as "/"}>
												{item.icon}
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}

				{userRole === "doctor" && (
					<SidebarGroup>
						<SidebarGroupLabel>پنل پزشکی</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{doctorLinks.map((item, index) => (
									<SidebarMenuItem key={index}>
										<SidebarMenuButton
											asChild
											isActive={isLinkActive(
												pathname,
												item.href,
											)}>
											<Link href={item.href as "/"}>
												{item.icon}
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}

				{userRole === "admin" && (
					<SidebarGroup>
						<SidebarGroupLabel>ادمین</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{adminLinks.map((item, index) => (
									<SidebarMenuItem key={index}>
										<SidebarMenuButton
											asChild
											isActive={isLinkActive(
												pathname,
												item.href,
											)}>
											<Link href={item.href as "/"}>
												{item.icon}
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}

				<SidebarGroup>
					<SidebarGroupLabel>عمومی</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{publicLinks.map((item, index) => (
								<SidebarMenuItem key={index}>
									<SidebarMenuButton
										asChild
										isActive={isLinkActive(
											pathname,
											item.href,
										)}>
										<Link href={item.href as "/"}>
											{item.icon}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>دسترسی سریع</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									variant={"outline"}
									onClick={handleLogout}
									className="mt-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive">
									<span>
										<LogOutIcon />
										خروج
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

export default PanelSidebar;

import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import requireAuth from "@/actions/auth/requireAuth.action";

export const metadata: Metadata = {
  title: "مدیریت مقالات",
  description: "بخش مدیریتی مقالات",
};

export default async function AdminArticlesLayout({ children }: PropsWithChildren) {
  await requireAuth({ requiredRoles: ["admin"], redirectPath: "/auth/login" });
  return <main className="app-px py-8">{children}</main>;
}

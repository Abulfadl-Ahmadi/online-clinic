"use client";

import { useUser } from "@/context";
import { CreditCard } from "lucide-react";
import { TransactionsList } from "@/components/finance";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

function TransactionsPage() {
	const { isLoading, isAuthenticated, user } = useUser();

	if ((!isLoading && !isAuthenticated) || !user) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<p className="text-lg font-medium">
					برای دسترسی به این صفحه باید ابتدا وارد شوید
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<CreditCard className="h-6 w-6 text-primary" />
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground">
						تراکنش‌های مالی
					</h1>
				</div>
				<p className="text-muted-foreground">
					مشاهده لیست تمام تراکنش‌های مالی شما
				</p>
			</div>

			{/* Summary Cards */}
			{/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							جمع تراکنش‌ها
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">--</div>
						<p className="text-xs text-muted-foreground mt-1">
							در حال بارگیری...
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							تراکنش‌های موفق
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-success">
							--
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							در حال بارگیری...
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							تراکنش‌های در انتظار
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-warning">
							--
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							در حال بارگیری...
						</p>
					</CardContent>
				</Card>
			</div> */}

			{/* Transactions List */}
			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					لیست تراکنش‌ها
				</h2>
				<TransactionsList page={1} />
			</div>
		</div>
	);
}

export default TransactionsPage;

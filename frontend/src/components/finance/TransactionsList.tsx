"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatDate } from "@/lib/utils";
import {
	getTransactionStatusText,
	getTransactionStatusVariant,
	formatTransactionDescription,
	formatCurrency,
	formatTransactionAmount,
} from "@/lib/labels";
import { getTransactions } from "@/actions";
import { Transaction, TransactionStatus } from "@/types";
import { Card, CardContent, Badge, Skeleton } from "@/components/ui";
import { ArrowRight, AlertCircle, CreditCard } from "lucide-react";

interface TransactionsListProps {
	page?: number;
}

/**
 * Transaction List Component
 * Displays a paginated list of user transactions with filtering and sorting
 */
function TransactionsList({ page = 1 }: TransactionsListProps) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTransactions = async () => {
			setIsLoading(true);
			setError(null);

			const result = await getTransactions(page);

			if (result.success) {
				setTransactions(result.data.results);
				setTotalCount(result.data.count);
			} else {
				setError(result.message);
				setTransactions([]);
			}

			setIsLoading(false);
		};

		fetchTransactions();
	}, [page]);

	// Skeleton loading state
	if (isLoading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 5 }).map((_, index) => (
					<Card key={index} className="overflow-hidden py-0">
						<CardContent className="p-4 sm:p-6">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-48" />
									<Skeleton className="h-3 w-32" />
								</div>
								<Skeleton className="h-8 w-20" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<Card className="border-destructive/30 bg-destructive/5">
				<CardContent>
					<div className="flex items-start gap-4">
						<AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
						<div>
							<h3 className="font-medium text-destructive mb-1">
								خطا در بارگیری تراکنش‌ها
							</h3>
							<p className="text-sm text-muted-foreground">
								{error}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Empty state
	if (transactions.length === 0) {
		return (
			<Card className="border-dashed py-0">
				<CardContent className="p-12 text-center">
					<CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
					<h3 className="font-medium text-foreground mb-1">
						هیچ تراکنشی یافت نشد
					</h3>
					<p className="text-sm text-muted-foreground">
						شما هنوز هیچ تراکنشی انجام نداده‌اید.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-3 flex flex-col">
			{transactions.map((transaction) => {
				const transactionLink = "/user/transactions/" + transaction.id;
				return (
					<Link key={transaction.id} href={transactionLink as "/"}>
						<Card className="overflow-hidden py-0 transition-all duration-200 hover:shadow-md hover:border-primary/30">
							<CardContent className="p-0">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
									{/* Transaction Details Section */}
									<div className="space-y-1 lg:col-span-2">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<h3 className="font-medium text-foreground">
													{formatTransactionDescription(transaction.description)}
												</h3>
												<div className="flex items-center gap-2 mt-1.5">
													<span className="text-xs text-muted-foreground">
														شناسه:
													</span>
													<code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground" dir="ltr">
														{transaction.id.slice(
															0,
															8,
														)}
														...
													</code>
												</div>
											</div>
										</div>

										{/* Mobile amount display */}
										<div className="flex sm:hidden items-center justify-between gap-2 pt-2 mt-2 border-t">
											<span className="text-xs text-muted-foreground">
												مبلغ:
											</span>
											<span className="font-semibold text-sm">
												{formatTransactionAmount(transaction.amount, transaction.currency).fullDisplay}
											</span>
										</div>
									</div>

									{/* Amount Section (hidden on mobile, shown on sm and up) */}
									<div className="hidden sm:flex flex-col items-end justify-center">
										<span className="text-xs text-muted-foreground mb-1">
											مبلغ پرداختی
										</span>
										<div className="flex items-baseline gap-1.5">
											<span className="text-lg font-bold text-foreground">
												{transaction.amount.toLocaleString("fa-IR")}
											</span>
											<span className="text-xs text-muted-foreground">
												{formatCurrency(transaction.currency || transaction.currencyDisplay)}
											</span>
										</div>
										{(transaction.currency?.toUpperCase() === "IRR" || !transaction.currency || transaction.currencyDisplay?.toLowerCase() === "rial") && (
											<span className="text-xs text-muted-foreground mt-0.5">
												معادل {Math.floor(transaction.amount / 10).toLocaleString("fa-IR")} تومان
											</span>
										)}
									</div>
								</div>

								{/* Footer: Date and Status */}
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 bg-muted/30 border-t">
									<div className="flex items-center gap-2 flex-wrap">
										<span className="text-xs text-muted-foreground">
											{formatDate(transaction.createdAt)}
										</span>
										{transaction.refId && (
											<span className="text-xs text-muted-foreground">
												• کد پیگیری:{" "}
												<span dir="ltr" className="font-mono">
													{transaction.refId}
												</span>
											</span>
										)}
									</div>
									<div className="flex items-center justify-between gap-2">
										<Badge
											variant={getTransactionStatusVariant(
												transaction.status as TransactionStatus,
											)}>
											{getTransactionStatusText(
												transaction.status as TransactionStatus,
												transaction.statusDisplay,
											)}
										</Badge>
										<ArrowRight className="size-4 text-muted-foreground rtl:rotate-180" />
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				);
			})}

			{/* Pagination Info */}
			<div className="flex items-center justify-center pt-4">
				<p className="text-sm text-muted-foreground">
					نمایش{" "}
					<span className="font-medium text-foreground">
						{transactions.length}
					</span>{" "}
					از{" "}
					<span className="font-medium text-foreground">
						{totalCount}
					</span>{" "}
					تراکنش
				</p>
			</div>
		</div>
	);
}

export default TransactionsList;

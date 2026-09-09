"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatDate, formatDateOnly } from "@/lib/utils";
import {
	getTransactionStatusText,
	getTransactionStatusVariant,
	formatTransactionDescription,
	formatCurrency,
} from "@/lib/labels";
import { getTransactionDetail } from "@/actions";
import { Transaction, TransactionStatus } from "@/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Badge,
	Skeleton,
	Separator,
} from "@/components/ui";
import {
	ArrowLeft,
	AlertCircle,
	CreditCard,
	Calendar,
	Phone,
	Mail,
	// FileText,
	CheckCircle2,
	Clock,
	XCircle,
	ArrowRight,
} from "lucide-react";

interface TransactionDetailProps {
	transactionId: string;
}

/**
 * Transaction Detail Component
 * Displays comprehensive information about a specific transaction
 */
function TransactionDetail({ transactionId }: TransactionDetailProps) {
	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTransaction = async () => {
			setIsLoading(true);
			setError(null);

			const result = await getTransactionDetail(transactionId);

			if (result.success) {
				setTransaction(result.data);
			} else {
				setError(result.message);
			}

			setIsLoading(false);
		};

		fetchTransaction();
	}, [transactionId]);

	// Loading state
	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-2">
					<Skeleton className="h-6 w-6" />
					<Skeleton className="h-8 w-48" />
				</div>

				<Card>
					<CardContent>
						<div className="space-y-4">
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-8 w-32" />
							</div>
							<Separator />
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-4 w-28" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-4 w-28" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error state
	if (error || !transaction) {
		return (
			<div className="space-y-6">
				<Link href="/user/transactions">
					<div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
						<ArrowRight className="h-4 w-4" />
						<span>بازگشت</span>
					</div>
				</Link>

				<Card className="border-destructive/30 bg-destructive/5">
					<CardContent>
						<div className="flex items-start gap-4">
							<AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
							<div>
								<h3 className="font-medium text-destructive mb-1">
									خطا در بارگیری اطلاعات تراکنش
								</h3>
								<p className="text-sm text-muted-foreground">
									{error || "تراکنش مورد نظر یافت نشد"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Back Button */}
			<Link href="/user/transactions">
				<div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
					<ArrowRight className="h-4 w-4" />
					<span>بازگشت به تراکنش‌ها</span>
				</div>
			</Link>

			{/* Main Card */}
			<Card className="overflow-hidden">
				<CardHeader className="pb-4">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1 space-y-1">
							<div className="flex items-center gap-2">
								{getStatusIcon(
									transaction.status as TransactionStatus,
								)}
								<CardTitle className="text-xl sm:text-2xl">
									{formatTransactionDescription(transaction.description)}
								</CardTitle>
							</div>
							<CardDescription></CardDescription>
						</div>
						<Badge
							variant={getTransactionStatusVariant(
								transaction.status as TransactionStatus,
							)}>
							{getTransactionStatusText(
								transaction.status as TransactionStatus,
								transaction.statusDisplay,
							)}
						</Badge>
					</div>
				</CardHeader>

				<Separator />

				{/* Amount Section */}
				<CardContent className="pt-6">
					<div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
						<p className="text-sm text-muted-foreground mb-1">
							مبلغ پرداختی
						</p>
						<div className="flex items-baseline gap-2">
							<span className="text-4xl font-bold text-foreground">
								{transaction.amount.toLocaleString("fa-IR")}
							</span>
							<span className="text-lg text-muted-foreground">
								{formatCurrency(transaction.currency || transaction.currencyDisplay)}
							</span>
						</div>
						{(transaction.currency?.toUpperCase() === "IRR" || !transaction.currency || transaction.currencyDisplay?.toLowerCase() === "rial") && (
							<p className="text-sm text-muted-foreground mt-2">
								معادل {Math.floor(transaction.amount / 10).toLocaleString("fa-IR")} تومان
							</p>
						)}
					</div>

					{/* Main Information Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
						{/* Transaction Date */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<p className="text-sm font-medium text-muted-foreground">
									تاریخ تراکنش
								</p>
							</div>
							<p className="text-foreground font-medium">
								{formatDate(transaction.createdAt)}
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								{new Date(
									transaction.createdAt,
								).toLocaleTimeString("fa-IR")}
							</p>
						</div>

						{/* Authority Code */}
						{/* <div>
							<div className="flex items-center gap-2 mb-2">
								<FileText className="h-4 w-4 text-muted-foreground" />
								<p className="text-sm font-medium text-muted-foreground">
									کد درخواست (Authority)
								</p>
							</div>
							<code className="text-foreground font-mono text-sm break-all">
								{transaction.authority}
							</code>
						</div> */}

						{/* Phone Number */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<p className="text-sm font-medium text-muted-foreground">
									شماره تماس
								</p>
							</div>
							<p
								className="text-foreground font-medium text-end"
								dir="ltr">
								{transaction.phoneNumber ||
									transaction.mobile ||
									"ثبت نشده"}
							</p>
						</div>

						{/* Email */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<p className="text-sm font-medium text-muted-foreground">
									ایمیل
								</p>
							</div>
							<p className="text-foreground font-medium">
								{transaction.email || "ثبت نشده"}
							</p>
						</div>
					</div>

					<Separator className="my-8" />

					{/* Additional Information */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">
							اطلاعات تکمیلی
						</h3>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Reference ID */}
							{transaction.refId && (
								<div className="p-3 bg-muted/50 rounded-lg">
									<p className="text-xs text-muted-foreground mb-1">
										شناسه پیگیری (کد مرجع)
									</p>
									<code className="text-sm font-mono break-all" dir="ltr">
										{transaction.refId}
									</code>
								</div>
							)}

							{/* Card Pan */}
							{transaction.cardPan && (
								<div className="p-3 bg-muted/50 rounded-lg">
									<p className="text-xs text-muted-foreground mb-1">
										شماره کارت پرداختی
									</p>
									<p className="text-sm font-medium font-mono text-start" dir="ltr">
										{transaction.cardPan}
									</p>
								</div>
							)}

							{/* Fee */}
							<div className="p-3 bg-muted/50 rounded-lg">
								<p className="text-xs text-muted-foreground mb-1">
									کارمزد
								</p>
								<p className="text-sm font-medium">
									{transaction.fee === 0
										? "رایگان"
										: transaction.fee.toLocaleString(
												"fa-IR",
										  ) +
										  " " +
										  formatCurrency(transaction.currency || transaction.currencyDisplay)}
								</p>
							</div>

							{/* Callback URL */}
							{/* <div className="p-3 bg-muted/50 rounded-lg">
								<p className="text-xs text-muted-foreground mb-1">
									URL بازخورد
								</p>
								<p className="text-xs font-medium truncate">
									{transaction.callbackUrl || "ثبت نشده"}
								</p>
							</div> */}
						</div>
					</div>

					{/* Updated At */}
					<div className="mt-6 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
						آخرین بروزرسانی: {formatDateOnly(transaction.updatedAt)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default TransactionDetail;

/**
 * Get the appropriate icon based on transaction status
 */
function getStatusIcon(status: TransactionStatus | string) {
	switch (status) {
		case "paid":
		case "completed":
			return <CheckCircle2 className="h-5 w-5 text-success" />;
		case "pending":
			return <Clock className="h-5 w-5 text-warning" />;
		case "failed":
		case "cancelled":
			return <XCircle className="h-5 w-5 text-destructive" />;
		default:
			return <CreditCard className="h-5 w-5 text-primary" />;
	}
}

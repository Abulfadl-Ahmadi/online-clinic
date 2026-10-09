"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/context";
import { TransactionDetail } from "@/components/finance";

function TransactionDetailPage() {
	const params = useParams();
	const transactionId = params.id as string;
	const { isLoading, isAuthenticated, user } = useUser();

	if (isLoading) {
		return <div role="status" className="p-6 text-muted-foreground">در حال بررسی حساب کاربری…</div>;
	}

	if (!isAuthenticated || !user) {
		return (
			<div className="flex flex-col items-center justify-center p-8">
				<p className="text-lg font-medium text-foreground">
					برای دسترسی به این صفحه باید ابتدا وارد شوید
				</p>
			</div>
		);
	}

	return (
		<div>
			<TransactionDetail transactionId={transactionId} />
		</div>
	);
}

export default TransactionDetailPage;

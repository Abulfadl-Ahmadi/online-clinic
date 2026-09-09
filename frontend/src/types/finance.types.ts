/** ================================
 *  Transaction Status
 *  ================================ */

export const TransactionStatus = {
	pending: "pending",
	paid: "paid",
	completed: "completed",
	failed: "failed",
	cancelled: "cancelled",
	refunded: "refunded",
} as const;

export type TransactionStatus = keyof typeof TransactionStatus;

/** ================================
 *  Currency Types
 *  ================================ */

export const Currency = {
	IRR: "IRR",
	USD: "USD",
	EUR: "EUR",
} as const;

export type Currency = keyof typeof Currency;

/** ================================
 *  Transaction Type
 *  ================================ */

export interface Transaction {
	id: string;
	phoneNumber: string;
	amount: number;
	currency: Currency;
	currencyDisplay: string;
	amountDisplay: string;
	description: string;
	authority: string;
	refId: string | null;
	status: TransactionStatus;
	statusDisplay: string;
	cardPan: string | null;
	fee: number;
	mobile: string | null;
	email: string | null;
	callbackUrl: string;
	createdAt: string;
	updatedAt: string;
}

/** ================================
 *  Paginated Response
 *  ================================ */

export interface PaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

export type TransactionsListResponse = PaginatedResponse<Transaction>;

/** ================================
 *  Payment Initiation
 *  ================================ */

export interface InitiatePaymentRequest {
	amount: number;
	currency: Currency;
	description: string;
	mobile?: string;
	email?: string;
	callback_url: string;
}

export interface InitiatePaymentResponse {
	authority: string;
	paymentUrl: string;
}

/** ================================
 *  Payment Verification
 *  ================================ */

export interface VerifyPaymentRequest {
	authority: string;
}

export interface VerifyPaymentResponse {
	success: boolean;
	refId?: string;
	cardPan?: string;
	fee?: number;
	message: string;
}

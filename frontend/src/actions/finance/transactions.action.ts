"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "@/actions/token";
import {
	ApiResult,
	TransactionsListResponse,
	Transaction,
} from "@/types";

/**
 * Fetch paginated list of user transactions
 * @param page - The page number for pagination (optional, defaults to 1)
 * @returns Promise with paginated transaction list or error
 */
async function getTransactions(
	page: number = 1,
): Promise<ApiResult<TransactionsListResponse>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "You must be authenticated to access transactions",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/finance/transactions/?page=${page}`;

	return apiFetch<TransactionsListResponse>(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
}

/**
 * Fetch a specific transaction by its ID
 * @param transactionId - The UUID of the transaction
 * @returns Promise with transaction details or error
 */
async function getTransactionDetail(
	transactionId: string,
): Promise<ApiResult<Transaction>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "You must be authenticated to access transaction details",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/finance/transactions/${transactionId}/`;

	return apiFetch<Transaction>(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
}

export { getTransactions, getTransactionDetail };

"use client";

import { toast } from "sonner";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useUserStore } from "@/lib/stores";
import type { User, UserRole } from "@/types";
import { getSession, getUser } from "@/actions";

interface UserContextValue {
	user: User | null;
	userRole: UserRole | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: React.PropsWithChildren) {
	const userStore = useUserStore();

	const hasFetched = useRef<boolean>(false);

	const [user, setUser] = useState<User | null>(null);
	const [userRole, setUserRole] = useState<UserRole | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	async function createData(data: User) {
		const { accessToken, userPayload } = await getSession();

		if (!accessToken || !userPayload) return;

		setUser(data);
		setUserRole(userPayload.role);
		setIsAuthenticated(true);

		userStore.set({
			user: data,
			isAuthenticated: true,
			useRole: userPayload.role,
		});
	}

	function reset() {
		setUser(null);
		setUserRole(null);
		setIsAuthenticated(false);
		userStore.reset();
	}

	useEffect(() => {
		const fetchUser = async () => {
			if (hasFetched.current) return; // prevent double-fetch on hydration
			hasFetched.current = true;

			setIsLoading(true);
			try {
				// Try to get user from server
				const result = await getUser();
				// if user is found, set it to the context
				if (result.success) {
					const userData = result.data;
					await createData(userData);
				} else {
					// if not, reset the context
					reset();
					// toast.error(result.message);
				}
			} catch (err) {
				if (process.env.NODE_ENV === "development") {
					console.error("[UserProvider getUser]", err);
				}
				// if error, reset the context
				reset();
				toast.error("خطا در دریافت اطلاعات کاربر");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userStore]);

	return (
		<UserContext.Provider
			value={{
				user,
				userRole,
				isLoading,
				isAuthenticated,
			}}>
			{children}
		</UserContext.Provider>
	);
}

/**
 * Custom hook for using the current user
 */
export function useUser() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a <UserProvider>");
	}
	return context;
}

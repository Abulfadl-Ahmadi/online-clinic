"use client";

import { create } from "zustand";
import { UserStore } from "@/types";

const useUserStore = create<UserStore>((set) => ({
	user: null,
	isAuthenticated: false,
	useRole: null,

	set: (patch) => set((state) => ({ ...state, ...patch })),
	reset: () =>
		set({
			user: null,
			isAuthenticated: false,
			useRole: null,

			set: () => {},
		}),
}));

export default useUserStore;

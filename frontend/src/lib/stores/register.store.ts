"use client";

import { create } from "zustand";
import { REGISTER_STORE_KEY, RegisterState } from "@/types";
import { persist, createJSONStorage } from "zustand/middleware";

const useRegisterStore = create<RegisterState>()(
	persist(
		(set) => ({
			// step 1
			national_code: "",
			first_name: "",
			last_name: "",
			// step 2
			birthday: "",
			gender: "other",
			// step 3
			password: "",
			confirmPassword: "",
			// extra
			step: 1,
			phoneVerified: false,

			set: (patch) => set((state) => ({ ...state, ...patch })),

			reset: () =>
				set({
					// step 1
					national_code: "",
					first_name: "",
					last_name: "",
					// step 2
					birthday: "",
					gender: "other",
					// step 3
					password: "",
					confirmPassword: "",
					// extra
					step: 1,
					phoneVerified: false,
				}),

			_hasHydrated: false,
			setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
		}),
		{
			name: REGISTER_STORE_KEY,

			// Store in Browser's localStorage only if browser is available
			storage: createJSONStorage(() => {
				if (typeof window !== "undefined") {
					return localStorage;
				}
				return {
					getItem: () => null,
					setItem: () => {},
					removeItem: () => {},
				};
			}),

			// Only save these states to storage (Not Password)
			partialize: (state) => ({
				// step 1
				national_code: state.national_code,
				first_name: state.first_name,
				last_name: state.last_name,
				// step 2
				birthday: state.birthday,
				gender: state.gender,
				// extra
				step: state.step,
				phoneVerified: state.phoneVerified,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);

export default useRegisterStore;

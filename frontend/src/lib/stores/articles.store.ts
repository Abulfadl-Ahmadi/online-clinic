"use client";

import { create } from "zustand";
import { Article } from "@/types";

interface ArticlesStore {
  list: Article[];
  detail: Record<string, Article>;
  set: (patch: Partial<ArticlesStore>) => void;
  reset: () => void;
}

const useArticlesStore = create<ArticlesStore>((set) => ({
  list: [],
  detail: {},
  set: (patch) => set((state) => ({ ...state, ...patch })),
  reset: () => set({ list: [], detail: {}, set: () => {} }),
}));

export default useArticlesStore;

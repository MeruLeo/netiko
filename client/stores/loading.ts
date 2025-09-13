import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),
}));

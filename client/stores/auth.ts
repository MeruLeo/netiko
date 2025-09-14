import { create } from "zustand";
import api from "@/lib/axios";
import { IUser } from "@/types/user";
import axios from "axios";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  fetchUser: async () => {
    try {
      const res = await api.get("/auth/me");
      console.log(res.data.user);
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err) {
      console.error("خطا در دریافت اطلاعات کاربر:", err);
      set({ user: null, isAuthenticated: false });
    }
  },

  clearUser: () => set({ user: null, isAuthenticated: false }),
}));

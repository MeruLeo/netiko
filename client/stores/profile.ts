import { create } from "zustand";
import api from "@/lib/axios";
import { IUser } from "@/types/user";

interface ProfileState {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  setMemoji: (memoji: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setMemoji: async (memoji: string) => {
    try {
      const res = await api.post("/profile/memoji", { memoji });

      if (res.data?.ok) {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, memoji: res.data.memoji },
            isAuthenticated: true,
          });
        }
      }
    } catch (err) {
      console.error("خطا در ست کردن میموجی:", err);
      set({ user: null, isAuthenticated: false });
    }
  },
}));

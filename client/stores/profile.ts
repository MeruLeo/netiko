import { create } from "zustand";
import api from "@/lib/axios";
import { IUser } from "@/types/user";

interface ProfileState {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  setMemoji: (memoji: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
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

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.ok) {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, avatar: res.data.avatar },
            isAuthenticated: true,
          });
        }
      }
    } catch (err) {
      console.error("خطا در آپلود آواتار:", err);
    }
  },

  deleteAvatar: async () => {
    try {
      const res = await api.delete("/profile/avatar");
      if (res.data?.ok) {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, avatar: undefined },
            isAuthenticated: true,
          });
        }
      }
    } catch (err) {
      console.error("خطا در حذف آواتار:", err);
    }
  },
}));

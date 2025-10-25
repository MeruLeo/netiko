import { create } from "zustand";
import { IUser } from "@/types/user";

interface ProfileState {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

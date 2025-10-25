import api from "@/lib/axios";
import { IUser } from "@/types/user";

export const authService = {
  async getMe() {
    const { data } = await api.get<{ user: IUser }>("/auth/me");
    return data.user;
  },

  async logout() {
    await api.post("/auth/logout");
  },
};

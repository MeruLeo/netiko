import api from "@/lib/axios";
import { IUser } from "@/types/user";

export const profileService = {
  async setMemoji(memoji: string) {
    const { data } = await api.post("/profile/memoji", { memoji });
    return data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await api.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async deleteAvatar() {
    const { data } = await api.delete("/profile/avatar");
    return data;
  },
};

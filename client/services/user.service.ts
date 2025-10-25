import api from "@/lib/axios";
import { IUserResponse } from "@/types/user";

export interface PaginatedUsers {
  items: IUserResponse[];
  total: number;
  page: number;
  pages: number;
}

export const userService = {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
  }) {
    const { data } = await api.get<PaginatedUsers>("/v1/users", { params });
    return data;
  },

  async getUserById(id: string) {
    const { data } = await api.get<IUserResponse>(`/v1/users/${id}`);
    return data;
  },
};

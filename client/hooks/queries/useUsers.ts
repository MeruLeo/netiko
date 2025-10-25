"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export const useUsers = (params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
}) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getUsers(params),
  });

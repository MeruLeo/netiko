"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export const useUser = (id?: string) => {
  useQuery({
    queryKey: ["user", id],
    queryFn: () => (id ? userService.getUserById(id) : null),
    enabled: !!id,
  });
};

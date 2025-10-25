"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const useAuth = () =>
  useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    retry: false,
  });

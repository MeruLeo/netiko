"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";

export const useSetMemoji = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.setMemoji,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

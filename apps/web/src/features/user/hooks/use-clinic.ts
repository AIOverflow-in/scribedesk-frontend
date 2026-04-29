"use client";

import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/lib/api-client";
import { ApiError } from "@workspace/schemas/api-error";
import type { UpdateClinicRequest } from "@workspace/schemas/user";
import { useAuth } from "@/contexts/AuthContext";

export function useUpdateClinic() {
  const { refetchUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateClinicRequest) => userApi.updateClinic(data),
    onSuccess: async () => {
      await refetchUser();
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        throw error;
      }
      throw error;
    },
  });
}
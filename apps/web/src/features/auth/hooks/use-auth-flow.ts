"use client";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "@/lib/api-client";
import { ApiError } from "@workspace/schemas/api-error";
import type { LoginRequest, RegisterRequest } from "@workspace/schemas/auth";
import { useAuth } from "@/contexts/AuthContext";

export function useAuthLogin() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async () => {
      await refetchUser();
      navigate({ to: "/" });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        throw error;
      }
      throw error;
    },
  });
}

export function useAuthRegister() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: async () => {
      await refetchUser();
      navigate({ to: "/" });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        throw error;
      }
      throw error;
    },
  });
}
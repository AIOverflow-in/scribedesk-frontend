"use client";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createApiClient, createAuthApi } from "@workspace/api-client";
import { ApiError } from "@workspace/schemas/api-error";
import type { LoginRequest, RegisterRequest } from "@workspace/schemas/auth";

const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
});

const authApi = createAuthApi(apiClient);

export function useAuthLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
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

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
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
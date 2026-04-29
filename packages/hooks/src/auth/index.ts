"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createAuthApi } from "@workspace/api-client/features/auth/api";
import type { LoginRequest, RegisterRequest } from "@workspace/schemas/auth";

export function useLogin(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });
}

export function useRegister(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

export function useLogout(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: () => authApi.logout(),
  });
}
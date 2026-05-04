"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createAuthApi } from "@workspace/api-client/features/auth/api";
import type {
  LoginRequest,
  RegisterRequest,
  GoogleRequest,
  OnboardingRequest,
  SetPasswordRequest,
  ConnectProviderRequest,
} from "@workspace/schemas/auth";

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

export function useGoogleLogin(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: (data: GoogleRequest) => authApi.google(data),
  });
}

export function useOnboarding(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: (data: OnboardingRequest) => authApi.onboarding(data),
  });
}

export function useLogout(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: () => authApi.logout(),
  });
}

export function useConnectProvider(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: (data: ConnectProviderRequest) => authApi.connectProvider(data),
  });
}

export function useDisconnectProvider(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: (providerId: string) => authApi.disconnectProvider(providerId),
  });
}

export function useSetPassword(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useMutation({
    mutationFn: (data: SetPasswordRequest) => authApi.setPassword(data),
  });
}

export function useProviders(client: ApiClient) {
  const authApi = createAuthApi(client);

  return useQuery({
    queryKey: ["auth", "providers"],
    queryFn: () => authApi.getProviders(),
  });
}

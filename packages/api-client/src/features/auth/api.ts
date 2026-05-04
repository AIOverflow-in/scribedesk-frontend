import type { ApiClient } from "../../core/client";
import type {
  LoginRequest,
  RegisterRequest,
  GoogleRequest,
  OnboardingRequest,
  AuthResponse,
  LogoutResponse,
  SetPasswordRequest,
  ConnectProviderRequest,
  ProvidersListResponse,
} from "@workspace/schemas/auth";

export function createAuthApi(client: ApiClient) {
  return {
    login: (data: LoginRequest) =>
      client.post<AuthResponse>("/auth/login", data),

    register: (data: RegisterRequest) =>
      client.post<AuthResponse>("/auth/register", data),

    google: (data: GoogleRequest) =>
      client.post<AuthResponse>("/auth/google", data),

    onboarding: (data: OnboardingRequest) =>
      client.post<AuthResponse>("/auth/onboarding", data),

    logout: () => client.post<LogoutResponse>("/auth/logout", {}),

    connectProvider: (data: ConnectProviderRequest) =>
      client.post<{ status: string }>("/auth/providers/connect", data),

    getProviders: () =>
      client.get<ProvidersListResponse>("/auth/providers"),

    disconnectProvider: (providerId: string) =>
      client.delete<{ status: string }>(`/auth/providers/${providerId}`),

    setPassword: (data: SetPasswordRequest) =>
      client.post<{ status: string }>("/auth/set-password", data),
  };
}

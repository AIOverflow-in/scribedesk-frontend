import type { ApiClient } from "../../core/client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LogoutResponse,
} from "@workspace/schemas/auth";

export function createAuthApi(client: ApiClient) {
  return {
    login: (data: LoginRequest) =>
      client.post<AuthResponse>("/auth/login", data),

    register: (data: RegisterRequest) =>
      client.post<AuthResponse>("/auth/register", data),

    logout: () => client.post<LogoutResponse>("/auth/logout", {}),
  };
}
import type { ApiErrorResponse } from "@workspace/schemas/api-error";
import { ApiError as BaseApiError } from "@workspace/schemas/api-error";

export interface ApiClientConfig {
  baseUrl: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new BaseApiError(response.status, data as ApiErrorResponse);
    }

    return data as T;
  }

  public get<T>(endpoint: string, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, body: unknown, options?: RequestInit) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public patch<T>(endpoint: string, body: unknown, options?: RequestInit) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export function createApiClient(config: ApiClientConfig) {
  return new ApiClient(config);
}

export { BaseApiError as ApiError };
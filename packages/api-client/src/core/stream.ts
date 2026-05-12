import type { ApiErrorResponse } from "@workspace/schemas/api-error";
import { ApiError as BaseApiError } from "@workspace/schemas/api-error";

export async function postStream(
  baseUrl: string,
  endpoint: string,
  body: unknown
): Promise<Response> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new BaseApiError(response.status, data as ApiErrorResponse);
  }

  return response;
}

export function getEventsUrl(baseUrl: string, endpoint: string): string {
  return `${baseUrl}${endpoint}`;
}

export async function readSSEStream(
  response: Response,
  onData: (raw: string) => void
): Promise<void> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        onData(trimmed.slice(6));
      }
    }
  }
}

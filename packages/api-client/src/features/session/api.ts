import type { ApiClient } from "../../core/client";
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionResponse,
  SessionTimelineEntry,
  PaginatedSessionsResponse,
} from "@workspace/schemas/session";

export function createSessionApi(client: ApiClient) {
  return {
    list: (page: number = 1, pageSize: number = 20, patientId?: string) => {
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
      if (patientId) params.set("patient_id", patientId)
      return client.get<PaginatedSessionsResponse>(`/sessions?${params}`)
    },

    get: (sessionId: string) =>
      client.get<SessionResponse>(`/sessions/${sessionId}`),

    create: (data: CreateSessionRequest) =>
      client.post<SessionResponse>("/sessions", data),

    update: (sessionId: string, data: UpdateSessionRequest) =>
      client.patch<SessionResponse>(`/sessions/${sessionId}`, data),

    getTimeline: (sessionId: string) =>
      client.get<SessionTimelineEntry[]>(`/sessions/${sessionId}/timeline`),

    delete: (sessionId: string) =>
      client.delete(`/sessions/${sessionId}`),
  };
}
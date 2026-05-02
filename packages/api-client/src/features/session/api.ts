import type { ApiClient } from "../../core/client";
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
  PauseSessionRequest,
  SessionResponse,
  SessionTimelineEntry,
  PaginatedSessionsResponse,
} from "@workspace/schemas/session";

export function createSessionApi(client: ApiClient) {
  return {
    list: (page: number = 1, pageSize: number = 20, patientId?: string, search?: string, sortBy?: string, sortOrder?: string) => {
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
      if (patientId) params.set("patient_id", patientId)
      if (search) params.set("search", search)
      if (sortBy) params.set("sort_by", sortBy)
      if (sortOrder) params.set("sort_order", sortOrder)
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

    pause: (sessionId: string, data: PauseSessionRequest) =>
      client.post<SessionResponse>(`/sessions/${sessionId}/pause`, data),

    delete: (sessionId: string) =>
      client.delete(`/sessions/${sessionId}`),
  };
}
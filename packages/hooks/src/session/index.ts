"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createSessionApi } from "@workspace/api-client/features/session/api";
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
} from "@workspace/schemas/session";

type UseSessionsOptions = {
  page?: number
  pageSize?: number
  patientId?: string
  search?: string
  sortBy?: string
  sortOrder?: string
}

export function useSessions(client: ApiClient, options: UseSessionsOptions = {}) {
  const { page = 1, pageSize = 20, patientId, search, sortBy = "created_at", sortOrder = "desc" } = options
  const sessionApi = createSessionApi(client);
  return useQuery({
    queryFn: () => sessionApi.list(page, pageSize, patientId, search, sortBy, sortOrder),
    queryKey: ["sessions", page, pageSize, patientId, search, sortBy, sortOrder],
  });
}

export function useSession(client: ApiClient, sessionId: string) {
  // Query key: ["session", sessionId]
  const sessionApi = createSessionApi(client);
  return useQuery({
    queryFn: () => sessionApi.get(sessionId),
    queryKey: ["session", sessionId],
    enabled: !!sessionId,
  });
}

export function useSessionTimeline(client: ApiClient, sessionId: string) {
  // Query key: ["sessionTimeline", sessionId]
  const sessionApi = createSessionApi(client);
  return useQuery({
    queryFn: () => sessionApi.getTimeline(sessionId),
    queryKey: ["sessionTimeline", sessionId],
    enabled: !!sessionId,
  });
}

export function useCreateSession(client: ApiClient) {
  // Mutation - invalidate ["sessions"] on success at app level
  const sessionApi = createSessionApi(client);
  return useMutation({
    mutationFn: (data: CreateSessionRequest) => sessionApi.create(data),
  });
}

export function useUpdateSession(client: ApiClient) {
  // Mutation - invalidate ["sessions"] and ["session", id] on success at app level
  const sessionApi = createSessionApi(client);
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: UpdateSessionRequest }) =>
      sessionApi.update(sessionId, data),
  });
}

export function useDeleteSession(client: ApiClient) {
  const sessionApi = createSessionApi(client);
  return useMutation({
    mutationFn: (sessionId: string) => sessionApi.delete(sessionId),
  });
}
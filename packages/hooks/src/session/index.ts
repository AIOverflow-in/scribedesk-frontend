"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createSessionApi } from "@workspace/api-client/features/session/api";
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
} from "@workspace/schemas/session";

export function useSessions(client: ApiClient, page: number = 1, pageSize: number = 20, patientId?: string) {
  const sessionApi = createSessionApi(client);
  return useQuery({
    queryFn: () => sessionApi.list(page, pageSize, patientId),
    queryKey: ["sessions", page, pageSize, patientId],
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
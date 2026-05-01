"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { sessionApi } from "@/lib/api-client";
import type { CreateSessionRequest, UpdateSessionRequest, SessionResponse } from "@workspace/schemas/session";
import { toast } from "@workspace/ui/components/sonner";

type UseScribeSessionsOptions = {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: string
  patientId?: string
}

export function useScribeSessions(options: UseScribeSessionsOptions = {}) {
  const { page = 1, pageSize = 20, search, sortBy = "created_at", sortOrder = "desc", patientId } = options
  return useQuery({
    queryFn: () => sessionApi.list(page, pageSize, patientId, search, sortBy, sortOrder),
    queryKey: ["sessions", page, pageSize, search, sortBy, sortOrder, patientId],
  });
}

export function useScribeSession(sessionId: string) {
  return useQuery({
    queryFn: () => sessionApi.get(sessionId),
    queryKey: ["session", sessionId],
    enabled: !!sessionId,
  });
}

export function useCreateScribeSession() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateSessionRequest) => sessionApi.create(data),
    onSuccess: (session: SessionResponse) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      navigate({ to: "/scribe", search: { id: session.id } });
    },
    onError: (error: Error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create session");
    },
  });
}

export function useUpdateScribeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: UpdateSessionRequest }) =>
      sessionApi.update(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session", variables.sessionId] });
      toast.success("Session updated");
    },
    onError: (error: Error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update session");
    },
  });
}

export function useScribeTimeline(sessionId: string) {
  return useQuery({
    queryFn: () => sessionApi.getTimeline(sessionId),
    queryKey: ["sessionTimeline", sessionId],
    enabled: !!sessionId,
  });
}

export function useDeleteScribeSession() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (sessionId: string) => sessionApi.delete(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session deleted");
      navigate({ to: "/scribe" });
    },
    onError: (error: Error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete session");
    },
  });
}

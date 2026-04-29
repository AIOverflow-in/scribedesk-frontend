"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { createTemplateApi } from "@workspace/api-client/features/template/api";
import type {
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "@workspace/schemas/template";

export function useTemplates(client: ApiClient) {
  // Query key: ["templates"]
  const templateApi = createTemplateApi(client);
  return useQuery({
    queryFn: () => templateApi.list(),
    queryKey: ["templates"],
  });
}

export function useTemplate(client: ApiClient, templateId: string) {
  // Query key: ["template", templateId]
  const templateApi = createTemplateApi(client);
  return useQuery({
    queryFn: () => templateApi.get(templateId),
    queryKey: ["template", templateId],
    enabled: !!templateId,
  });
}

export function useCreateTemplate(client: ApiClient) {
  // Mutation - invalidate ["templates"] on success at app level
  const templateApi = createTemplateApi(client);
  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templateApi.create(data),
  });
}

export function useUpdateTemplate(client: ApiClient) {
  // Mutation - invalidate ["templates"] and ["template", id] on success at app level
  const templateApi = createTemplateApi(client);
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: UpdateTemplateRequest }) =>
      templateApi.update(templateId, data),
  });
}

export function useDeleteTemplate(client: ApiClient) {
  // Mutation - invalidate ["templates"] on success at app level
  const templateApi = createTemplateApi(client);
  return useMutation({
    mutationFn: (templateId: string) => templateApi.delete(templateId),
  });
}
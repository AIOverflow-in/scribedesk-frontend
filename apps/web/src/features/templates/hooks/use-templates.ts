"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { templateApi } from "@/lib/api-client";
import type { CreateTemplateRequest, UpdateTemplateRequest } from "@workspace/schemas";

export function useTemplates() {
  return useQuery({
    queryFn: () => templateApi.list(),
    queryKey: ["templates"],
  });
}

export function useTemplate(templateId: string) {
  return useQuery({
    queryFn: () => templateApi.get(templateId),
    queryKey: ["template", templateId],
    enabled: !!templateId,
  });
}

export function useCreateTemplate() {
  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => templateApi.create(data),
  });
}

export function useUpdateTemplate() {
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: string; data: UpdateTemplateRequest }) =>
      templateApi.update(templateId, data),
  });
}

export function useDeleteTemplate() {
  return useMutation({
    mutationFn: (templateId: string) => templateApi.delete(templateId),
  });
}

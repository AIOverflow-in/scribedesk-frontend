import type { ApiClient } from "../../core/client";
import type {
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateResponse,
  DeleteTemplateResponse,
} from "@workspace/schemas/template";

export function createTemplateApi(client: ApiClient) {
  return {
    list: () => client.get<TemplateResponse[]>("/templates"),

    get: (templateId: string) =>
      client.get<TemplateResponse>(`/templates/${templateId}`),

    create: (data: CreateTemplateRequest) =>
      client.post<TemplateResponse>("/templates", data),

    update: (templateId: string, data: UpdateTemplateRequest) =>
      client.patch<TemplateResponse>(`/templates/${templateId}`, data),

    delete: (templateId: string) =>
      client.delete<DeleteTemplateResponse>(`/templates/${templateId}`),
  };
}
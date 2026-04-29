import { z } from "zod";

export const createTemplateRequestSchema = z.object({
  name: z.string().min(1).max(255),
  root_type: z.enum(["notes", "letters", "prescription"]),
  content: z.string().min(1),
});

export const updateTemplateRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
});

export const templateResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  root_type: z.string(),
  sub_type: z.string().optional(),
  content: z.string(),
  is_system: z.boolean(),
  user_id: z.uuid().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const deleteTemplateResponseSchema = z.object({
  status: z.string(),
});

export type CreateTemplateRequest = z.infer<typeof createTemplateRequestSchema>;
export type UpdateTemplateRequest = z.infer<typeof updateTemplateRequestSchema>;
export type TemplateResponse = z.infer<typeof templateResponseSchema>;
export type DeleteTemplateResponse = z.infer<typeof deleteTemplateResponseSchema>;
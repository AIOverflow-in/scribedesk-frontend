import { z } from "zod";

export const createReportRequestSchema = z.object({
  session_id: z.uuid(),
  template_id: z.uuid(),
  additional_context: z.string().max(2000).optional(),
});

export const updateReportRequestSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  report_metadata: z.record(z.string(), z.unknown()).optional(),
});

export const reportResponseSchema = z.object({
  id: z.uuid(),
  session_id: z.uuid(),
  template_id: z.uuid(),
  title: z.string(),
  content: z.string(),
  report_metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  is_signed: z.boolean(),
  signed_at: z.string().optional().nullable(),
  content_hash: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const reportMetadataSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  template_name: z.string(),
  created_at: z.string(),
});

export type CreateReportRequest = z.infer<typeof createReportRequestSchema>;
export type UpdateReportRequest = z.infer<typeof updateReportRequestSchema>;
export type ReportResponse = z.infer<typeof reportResponseSchema>;
export type ReportMetadata = z.infer<typeof reportMetadataSchema>;
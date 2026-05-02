import { z } from "zod";
import { createPaginatedResponseSchema } from "./common";
import { reportMetadataSchema } from "./report";

export const createSessionRequestSchema = z.object({
  patient_id: z.uuid().optional(),
});

export const updateSessionRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  patient_id: z.uuid().nullable().optional(),
  clinical_summary: z.string().optional(),
});

export const pauseSessionRequestSchema = z.object({
  generate_summary: z.boolean(),
});

export const sessionResponseSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  patient_id: z.uuid().optional(),
  patient_name: z.string().optional(),
  patient_gender: z.string().optional(),
  patient_age: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  total_audio_seconds: z.number(),
  current_segment_start: z.string().optional().nullable(),
  clinical_summary: z.string().optional().nullable(),
  last_summarized_transcript_id: z.uuid().optional().nullable(),
  reports: z.array(reportMetadataSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export const sessionListItemSchema = z.object({
  id: z.uuid(),
  patient_id: z.uuid().optional(),
  patient_name: z.string().optional(),
  patient_gender: z.string().optional(),
  patient_age: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  total_audio_seconds: z.number(),
  current_segment_start: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const sessionTimelineEntrySchema = z.object({
  id: z.uuid(),
  session_id: z.uuid(),
  type: z.string(),
  event_type: z.string().optional(),
  content: z.string().optional(),
  speaker_id: z.number().optional(),
  relative_seconds: z.number().optional(),
  created_at: z.string(),
});

export const paginatedSessionsResponseSchema = createPaginatedResponseSchema(sessionListItemSchema);

export const wsReadySchema = z.object({
  type: z.literal("ready"),
  accumulated_seconds: z.number(),
});

export const wsTranscriptSchema = z.object({
  type: z.literal("transcript"),
  text: z.string(),
  timestamp: z.number(),
});

export const wsEventSchema = z.discriminatedUnion("type", [wsReadySchema, wsTranscriptSchema]);

export type CreateSessionRequest = z.infer<typeof createSessionRequestSchema>;
export type UpdateSessionRequest = z.infer<typeof updateSessionRequestSchema>;
export type PauseSessionRequest = z.infer<typeof pauseSessionRequestSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type SessionListItem = z.infer<typeof sessionListItemSchema>;
export type SessionTimelineEntry = z.infer<typeof sessionTimelineEntrySchema>;
export type PaginatedSessionsResponse = z.infer<typeof paginatedSessionsResponseSchema>;
export type WsReady = z.infer<typeof wsReadySchema>;
export type WsTranscript = z.infer<typeof wsTranscriptSchema>;
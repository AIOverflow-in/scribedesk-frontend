import { z } from "zod";
import { createPaginatedResponseSchema } from "./common";

// ── Request ──────────────────────────────────────────────────────────────────

export const sendMessageRequestSchema = z.object({
  conversation_id: z.uuid().nullable(),
  message: z.string(),
  session_id: z.uuid().nullable(),
  patient_id: z.uuid().nullable(),
});

// ── SSE stream events (POST /chats/messages) ─────────────────────────────────

export const chatMetadataCreatedSchema = z.object({
  type: z.literal("metadata"),
  metadata_type: z.literal("conversation_created"),
  data: z.object({
    conversation_id: z.uuid(),
  }),
});

export const chatMetadataCitationsSchema = z.object({
  type: z.literal("metadata"),
  metadata_type: z.literal("citations"),
  data: z.object({
    count: z.number(),
    items: z.array(z.any()),
  }),
});

export const chatStatusSchema = z.object({
  type: z.literal("status"),
  status_message: z.string(),
});

export const chatToolCallSchema = z.object({
  type: z.literal("tool_call"),
  tool_name: z.string(),
  status_message: z.string(),
  data: z
    .object({
      result: z.any(),
    })
    .optional(),
});

export const chatContentSchema = z.object({
  type: z.literal("content"),
  content: z.string(),
});

export const chatErrorSchema = z.object({
  type: z.literal("error"),
  error: z.string(),
});

export const chatDoneSchema = z.object({
  type: z.literal("done"),
});

export const chatStreamEventSchema = z.union([
  chatMetadataCreatedSchema,
  chatMetadataCitationsSchema,
  chatStatusSchema,
  chatToolCallSchema,
  chatContentSchema,
  chatErrorSchema,
  chatDoneSchema,
]);

// ── SSE push events (GET /events) ────────────────────────────────────────────

export const chatTitleGeneratedSchema = z.object({
  event_type: z.literal("chat_title_generated"),
  data: z.object({
    conv_id: z.string(),
    title: z.string(),
  }),
  timestamp: z.string(),
});

export const chatPushEventSchema = z.discriminatedUnion("event_type", [
  chatTitleGeneratedSchema,
]);

// ── Responses ────────────────────────────────────────────────────────────────

export const conversationListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  is_title_generated: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const paginatedConversationsResponseSchema =
  createPaginatedResponseSchema(conversationListItemSchema);

export const messageResponseSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  artifacts: z.any().nullable().optional(),
  created_at: z.string(),
});

export const conversationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  is_title_generated: z.boolean(),
  session_id: z.string().nullable(),
  patient_id: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  messages: z.array(messageResponseSchema),
});

// ── Inferred types ───────────────────────────────────────────────────────────

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export type ChatStreamEvent = z.infer<typeof chatStreamEventSchema>;
export type ChatMetadataCreated = z.infer<typeof chatMetadataCreatedSchema>;
export type ChatMetadataCitations = z.infer<typeof chatMetadataCitationsSchema>;
export type ChatStatus = z.infer<typeof chatStatusSchema>;
export type ChatToolCall = z.infer<typeof chatToolCallSchema>;
export type ChatContent = z.infer<typeof chatContentSchema>;
export type ChatError = z.infer<typeof chatErrorSchema>;
export type ChatDone = z.infer<typeof chatDoneSchema>;

export type ChatPushEvent = z.infer<typeof chatPushEventSchema>;
export type ChatTitleGenerated = z.infer<typeof chatTitleGeneratedSchema>;

export type ConversationListItem = z.infer<typeof conversationListItemSchema>;
export type PaginatedConversationsResponse = z.infer<
  typeof paginatedConversationsResponseSchema
>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;

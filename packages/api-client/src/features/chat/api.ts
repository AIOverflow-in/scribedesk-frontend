import { postStream } from "../../core/stream";
import type { ApiClient } from "../../core/client";
import type {
  SendMessageRequest,
  PaginatedConversationsResponse,
  ConversationResponse,
} from "@workspace/schemas/chat";

export function createChatApi(client: ApiClient) {
  return {
    sendMessage: (data: SendMessageRequest) =>
      postStream(client.baseUrl, "/chats/messages", data),

    listConversations: (
      page = 1,
      pageSize = 20,
      sessionId?: string
    ) => {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
      if (sessionId) params.set("session_id", sessionId);
      return client.get<PaginatedConversationsResponse>(
        `/chats?${params}`
      );
    },

    getConversation: (conversationId: string) =>
      client.get<ConversationResponse>(`/chats/${conversationId}`),

    deleteConversation: (conversationId: string) =>
      client.delete(`/chats/${conversationId}`),
  };
}

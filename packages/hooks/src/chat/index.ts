"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { ApiClient } from "@workspace/api-client";
import { readSSEStream } from "@workspace/api-client/core/stream";
import { createChatApi } from "@workspace/api-client/features/chat/api";
import { chatStreamEventSchema } from "@workspace/schemas/chat";
import type {
  SendMessageRequest,
  ChatStreamEvent,
} from "@workspace/schemas/chat";

type UseConversationsOptions = {
  page?: number;
  pageSize?: number;
  sessionId?: string;
};

export function useConversations(
  client: ApiClient,
  options: UseConversationsOptions = {}
) {
  const { page = 1, pageSize = 20, sessionId } = options;
  const chatApi = createChatApi(client);
  return useQuery({
    queryFn: () => chatApi.listConversations(page, pageSize, sessionId),
    queryKey: ["conversations", page, pageSize, sessionId],
  });
}

export function useConversation(client: ApiClient, conversationId: string) {
  const chatApi = createChatApi(client);
  return useQuery({
    queryFn: () => chatApi.getConversation(conversationId),
    queryKey: ["conversation", conversationId],
    enabled: !!conversationId,
  });
}

export function useDeleteConversation(client: ApiClient) {
  const chatApi = createChatApi(client);
  return useMutation({
    mutationFn: (conversationId: string) =>
      chatApi.deleteConversation(conversationId),
  });
}

export function useSendChatMessage(client: ApiClient) {
  const chatApi = createChatApi(client);

  return useMutation({
    mutationFn: async ({
      data,
      onEvent,
    }: {
      data: SendMessageRequest;
      onEvent: (event: ChatStreamEvent) => void;
    }) => {
      const response = await chatApi.sendMessage(data);

      await readSSEStream(response, (raw) => {
        const event = chatStreamEventSchema.parse(JSON.parse(raw));
        onEvent(event);
      });
    },
  });
}

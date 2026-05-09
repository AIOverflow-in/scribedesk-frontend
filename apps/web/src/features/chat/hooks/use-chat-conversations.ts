"use client";

import { useEffect } from "react"
import { useConversations, useConversation } from "@workspace/hooks/chat"
import type { MessageResponse } from "@workspace/schemas/chat"
import { apiClient } from "@/lib/api-client"
import { useChatStore } from "../stores/chat-store"
import type { ChatMessage } from "../types"
import React from "react";

type UseConversationsOptions = {
  page?: number
  pageSize?: number
  sessionId?: string
}

export function useChatConversations(options: UseConversationsOptions = {}) {
  return useConversations(apiClient, options)
}

function mapMessages(msgs: MessageResponse[]): ChatMessage[] {
  return msgs.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: m.created_at,
  }))
}

export function useChatConversation(conversationId: string) {
  const query = useConversation(apiClient, conversationId)
  const setMessages = useChatStore((s) => s.setMessages)
  const initialized = React.useRef(false)

  useEffect(() => {
    if (query.data && !initialized.current) {
      initialized.current = true
      const existing = useChatStore.getState().messages[conversationId]
      if (!existing || existing.length === 0) {
        setMessages(
          conversationId,
          mapMessages(query.data.messages || [])
        )
      }
    }
  }, [query.data, conversationId, setMessages])

  return query
}

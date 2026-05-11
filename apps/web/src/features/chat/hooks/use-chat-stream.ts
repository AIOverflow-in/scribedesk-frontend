"use client";

import { useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useSendChatMessage } from "@workspace/hooks/chat"
import { apiClient } from "@/lib/api-client"
import { useChatStore } from "../stores/chat-store"
import type { SendMessageRequest } from "@workspace/schemas/chat"

export function useChatStream({
  navigateOnCreate = true,
}: { navigateOnCreate?: boolean } = {}) {
  const { mutate, isPending } = useSendChatMessage(apiClient)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const addMessage = useChatStore((s) => s.addMessage)
  const appendStreamingContent = useChatStore((s) => s.appendStreamingContent)
  const completeStreaming = useChatStore((s) => s.completeStreaming)
  const setStreamingStatusMessage = useChatStore(
    (s) => s.setStreamingStatusMessage
  )
  const setCitations = useChatStore((s) => s.setCitations)
  const setStreamingToolCall = useChatStore((s) => s.setStreamingToolCall)
  const promoteLocalThread = useChatStore((s) => s.promoteLocalThread)
  const setStreamingConversationId = useChatStore(
    (s) => s.setStreamingConversationId
  )

  const sendMessage = useCallback(
    (data: SendMessageRequest) => {
      const initialThreadId = useChatStore.getState().activeThreadId
      if (!initialThreadId) return

      addMessage(initialThreadId, {
        role: "user",
        content: data.message,
        status: "sent",
      })
      setStreamingStatusMessage("Thinking...")
      setCitations(initialThreadId, [])

      const getThreadId = () =>
        useChatStore.getState().activeThreadId || initialThreadId

      mutate(
        {
          data,
          onEvent: (event) => {
            const tid = getThreadId()

            switch (event.type) {
              case "metadata":
                if (event.metadata_type === "conversation_created") {
                  const convId = event.data.conversation_id
                  setStreamingConversationId(convId)
                  promoteLocalThread(initialThreadId, convId)
                  if (navigateOnCreate) {
                    navigate({
                      to: "/chats/$id",
                      params: { id: convId },
                    })
                  }
                }
                if (event.metadata_type === "citations") {
                  setCitations(tid, event.data.items)
                }
                break

              case "status":
                setStreamingStatusMessage(event.status_message)
                break

              case "content":
                appendStreamingContent(tid, event.content)
                break

              case "tool_call":
                setStreamingToolCall(tid, {
                  toolName: event.tool_name,
                  statusMessage: event.status_message,
                  hasResult: !!event.data,
                })
                break

              case "done":
                completeStreaming(tid)
                queryClient.invalidateQueries({
                  queryKey: ["conversation", tid],
                })
                break

              case "error":
                completeStreaming(tid)
                addMessage(tid, {
                  role: "assistant",
                  content: `Error: ${event.error}`,
                  status: "error",
                })
                break
            }
          },
        },
        {
          onError: () => {
            const tid = getThreadId()
            completeStreaming(tid)
            addMessage(tid, {
              role: "assistant",
              content: "Failed to send message. Please try again.",
              status: "error",
            })
          },
        }
      )
    },
    [
      addMessage,
      appendStreamingContent,
      completeStreaming,
      setStreamingStatusMessage,
      setCitations,
      setStreamingToolCall,
      promoteLocalThread,
      setStreamingConversationId,
      mutate,
      navigate,
      queryClient,
    ]
  )

  return { sendMessage, isPending }
}

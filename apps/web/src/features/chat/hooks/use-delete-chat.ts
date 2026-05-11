"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { chatApi } from "@/lib/api-client"
import { toast } from "@workspace/ui/components/sonner"
import { useChatStore } from "../stores/chat-store"
import { ApiError } from "@workspace/schemas/api-error"

export function useDeleteChat(options?: { skipNavigation?: boolean }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const activeThreadId = useChatStore((s) => s.activeThreadId)
  const removeLocalThread = useChatStore((s) => s.removeLocalThread)

  return useMutation({
    mutationFn: (conversationId: string) =>
      chatApi.deleteConversation(conversationId),

    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      queryClient.removeQueries({ queryKey: ["conversation", conversationId] })
      removeLocalThread(conversationId)

      if (!options?.skipNavigation && activeThreadId === conversationId) {
        navigate({ to: "/chats" })
      }

      toast.success("Chat deleted")
    },

    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Failed to delete chat")
      }
    },
  })
}

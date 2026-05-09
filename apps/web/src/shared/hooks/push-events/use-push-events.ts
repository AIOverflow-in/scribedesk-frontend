"use client";

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getEventsUrl } from "@workspace/api-client"
import { chatPushEventSchema } from "@workspace/schemas/chat"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/contexts/AuthContext"
import { handleChatTitleGenerated } from "./handlers/chat-title-generated"

export function usePushEvents() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isAuthenticated) return

    const url = getEventsUrl(apiClient.baseUrl, "/events")
    const es = new EventSource(url, { withCredentials: true })

    es.onmessage = (event) => {
      try {
        const parsed = chatPushEventSchema.parse(JSON.parse(event.data))

        switch (parsed.event_type) {
          case "chat_title_generated":
            handleChatTitleGenerated(parsed.data, { queryClient })
            break
        }
      } catch {
        // skip malformed events
      }
    }

    es.onerror = () => {}

    return () => es.close()
  }, [isAuthenticated, queryClient])
}

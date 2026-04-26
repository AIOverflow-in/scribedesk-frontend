import { createFileRoute } from "@tanstack/react-router"
import { ChatViewPage } from "@workspace/features/chat/pages/chat-view-page"

export const Route = createFileRoute("/(protected)/chats/$id")({
  component: ChatRoute,
})

function ChatRoute() {
  return <ChatViewPage />
}

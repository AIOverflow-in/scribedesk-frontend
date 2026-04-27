import { createFileRoute } from "@tanstack/react-router"
import { ChatsPage } from "@workspace/features/chat/pages/chats-page"

export const Route = createFileRoute("/(protected)/chats/")({
  component: ChatsRoute,
})

function ChatsRoute() {
  return <ChatsPage />
}

import { useParams, useNavigate } from "@tanstack/react-router"
import { ChatWindow } from "../components/chat-view/chat-window"

export function ChatViewPage() {
  const { id } = useParams({ strict: false }) as any
  const navigate = useNavigate()

  return (
    <div className="flex h-[calc(100vh-2.75rem)] overflow-hidden -m-6 bg-background">
      <ChatWindow 
        mode="workspace" 
        threadId={id} 
        onClose={() => navigate({ to: '/chats' })} 
      />
    </div>
  )
}

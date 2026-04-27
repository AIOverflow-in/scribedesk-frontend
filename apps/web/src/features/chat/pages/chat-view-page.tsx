import * as React from "react"
import { useParams, useNavigate } from "@tanstack/react-router"
import { DashboardLayout } from "@/shared/layout/dashboard-layout"
import { ChatWindow } from "../components/chat-view/chat-window"
import { useChatStore } from "../stores/chat-store"

export function ChatViewPage() {
  const { id } = useParams({ strict: false }) as any
  const navigate = useNavigate()
  const { setActiveThread } = useChatStore()

  // FORCE sync the store whenever the URL ID changes
  React.useEffect(() => {
    if (id) {
      setActiveThread(id)
    }
  }, [id, setActiveThread])

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-2.75rem)] overflow-hidden -m-6 bg-background">
        <ChatWindow 
          mode="workspace" 
          threadId={id} 
          onClose={() => navigate({ to: '/chats' })} 
        />
      </div>
    </DashboardLayout>
  )
}

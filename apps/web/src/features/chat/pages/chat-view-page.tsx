import * as React from "react"
import { useParams, useNavigate } from "@tanstack/react-router"
import { DashboardLayout } from "@/shared/layout/dashboard-layout"
import { ChatWindow } from "../components/chat-view/chat-window"

export function ChatViewPage() {
  const { id } = useParams({ strict: false }) as any
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-background">
        <ChatWindow 
          mode="workspace" 
          threadId={id} 
          onClose={() => navigate({ to: '/chats' })} 
        />
      </div>
    </DashboardLayout>
  )
}

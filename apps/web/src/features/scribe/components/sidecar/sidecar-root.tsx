import * as React from "react"
import { useScribe } from "../../context/scribe-context"
import { ChatWindow } from "@/features/chat/components/chat-view/chat-window"
import { useChatStore } from "@/features/chat/stores/chat-store"

export function ScribeSidecar() {
  const { toggleSidecar, consultation } = useScribe()
  const { threads } = useChatStore()

  // 1. Find the thread associated with this consultation
  const threadId = React.useMemo(() => {
    if (!consultation?.id) return null
    return threads.find(t => t.context?.id === consultation.id)?.id || null
  }, [threads, consultation?.id])

  return (
    <div className="w-full bg-background flex flex-col h-full border-l shadow-xs overflow-hidden">
      <ChatWindow 
        mode="sidecar" 
        threadId={threadId} 
        onClose={() => toggleSidecar()} 
      />
    </div>
  )
}

import * as React from "react"
import { useScribe } from "../../context/scribe-context"
import { ChatWindow } from "@/features/chat/components/chat-view/chat-window"
import { useChatStore } from "@/features/chat/stores/chat-store"

export function ScribeSidecar() {
  const { toggleSidecar, consultation } = useScribe()
  const [selectedThreadId, setSelectedThreadId] = React.useState<string | null>(null)
  const setActiveThread = useChatStore((s) => s.setActiveThread)

  React.useEffect(() => {
    setActiveThread(null)
    setSelectedThreadId(null)
  }, [consultation?.id, setActiveThread])

  const threadId = selectedThreadId || 'new'

  return (
    <div className="w-full bg-background flex flex-col h-full border-l shadow-xs overflow-hidden">
      <ChatWindow
        mode="sidecar"
        threadId={threadId}
        sessionId={consultation?.id}
        onClose={() => toggleSidecar()}
        onSelectThread={setSelectedThreadId}
      />
    </div>
  )
}

import * as React from "react"
import { useScribe } from "../../context/scribe-context"
import { ChatWindow } from "@/features/chat/components/chat-view/chat-window"
import { useChatConversations } from "@/features/chat/hooks/use-chat-conversations"

export function ScribeSidecar() {
  const { toggleSidecar, consultation } = useScribe()
  const { data: conversationsData } = useChatConversations({
    sessionId: consultation?.id,
  })

  const threadId = React.useMemo(() => {
    if (!consultation?.id || !conversationsData?.items?.length) return null
    return conversationsData.items[0].id
  }, [consultation?.id, conversationsData])

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

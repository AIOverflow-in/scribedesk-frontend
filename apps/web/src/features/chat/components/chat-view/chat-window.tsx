import * as React from "react"
import { Drone } from "lucide-react"
import { Spinner } from "@workspace/ui/components/spinner"
import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { ChatMessageList } from "./chat-message-list"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import { useChatStore } from "../../stores/chat-store"
import { useChatConversation } from "../../hooks/use-chat-conversations"

interface ChatWindowProps {
  mode: 'sidecar' | 'workspace'
  threadId: string | null
  sessionId?: string
  onClose?: () => void
}

export function ChatWindow({ mode, threadId, sessionId, onClose }: ChatWindowProps) {
  const { messages, setActiveThread, activeThreadId } = useChatStore()

  const isNewPlaceholder = threadId === 'new'
  const isLocal = threadId?.startsWith("local-")
  const effectiveId = (isNewPlaceholder || isLocal || !threadId) ? null : threadId

  const { isLoading: isConversationLoading } =
    useChatConversation(effectiveId || "")

  const messageThreadId = isNewPlaceholder ? activeThreadId : threadId
  const activeMessages = messageThreadId ? messages[messageThreadId] || [] : []

  React.useEffect(() => {
    setActiveThread(threadId === 'new' ? null : threadId)
  }, [threadId, setActiveThread])

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <ChatHeader mode={mode} sessionId={sessionId} onClose={onClose} />
      
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {activeMessages.length === 0 && isConversationLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : activeMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Empty className="border-none bg-transparent shadow-none">
              <EmptyHeader className="items-center">
                <EmptyMedia variant="icon" className="size-20 bg-primary/10 text-primary shadow-sm">
                  <Drone className="size-10" />
                </EmptyMedia>
                <EmptyTitle className="text-2xl mt-4">How can I help you today?</EmptyTitle>
                <EmptyDescription className="text-base max-w-sm text-center">
                  I can help you analyze patient data, draft clinical summaries, or answer medical queries.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <div className="flex-1 relative min-h-0 flex flex-col">
            <div className="absolute top-0 inset-x-0 h-4 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
            <ChatMessageList messages={activeMessages} />
          </div>
        )}
        
        {/* Tightened Input area with reduced width */}
        <div className="w-full pb-1 relative z-10 -mt-6">
           <div className="max-w-3xl mx-auto px-4">
              <ChatInput />
              <p className="text-[10px] text-muted-foreground text-center mt-1.5 font-medium">
                AI can make mistakes. Always verify clinical recommendations.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}

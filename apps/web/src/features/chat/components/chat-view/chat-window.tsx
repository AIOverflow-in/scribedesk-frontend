import * as React from "react"
import { Drone } from "lucide-react"
import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import { useChatStore } from "../../stores/chat-store"

interface ChatWindowProps {
  mode: 'sidecar' | 'workspace'
  threadId: string | null
  onClose?: () => void
}

export function ChatWindow({ mode, threadId, onClose }: ChatWindowProps) {
  const { messages, setActiveThread } = useChatStore()
  const activeMessages = threadId ? messages[threadId] || [] : []

  // Sync active thread to store when opened in sidecar/workspace
  React.useEffect(() => {
    if (threadId) setActiveThread(threadId)
  }, [threadId, setActiveThread])

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <ChatHeader mode={mode} onClose={onClose} />
      
      <div className="flex-1 overflow-hidden p-6 flex flex-col">
        {activeMessages.length === 0 ? (
          <Empty className="flex-1 border-none bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-indigo-500/10 text-indigo-500 size-16 mb-4">
                <Drone className="size-8" />
              </EmptyMedia>
              <EmptyTitle className="text-lg font-bold text-foreground/90">Clinical Intelligence</EmptyTitle>
              <EmptyDescription className="text-sm max-w-[320px] leading-relaxed">
                I'm listening and analyzing clinical data in real-time. 
                Ask me to check history, identify red flags, or draft documents.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4">
             {activeMessages.map(msg => (
               <div key={msg.id} className="text-sm p-4 bg-muted/30 rounded-xl">
                 <span className="font-bold uppercase text-[10px] text-muted-foreground block mb-1">{msg.role}</span>
                 {msg.content}
               </div>
             ))}
          </div>
        )}
        
        <div className="mt-auto">
           <ChatInput />
        </div>
      </div>
    </div>
  )
}

import * as React from "react"
import { Drone } from "lucide-react"
import { useScribe } from "../../context/scribe-context"
import { ChatHeader } from "./chat/chat-header"
import { ChatInput } from "./chat/chat-input"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"

export function ScribeSidecar() {
  const { sidecarView, activeChatId } = useScribe()

  return (
    <div className="w-full bg-background flex flex-col h-full border-l shadow-xs overflow-hidden">
      {sidecarView === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0 min-w-[400px]">
          <ChatHeader />
          <div className="flex-1 overflow-hidden p-6 flex flex-col">
            {!activeChatId ? (
              <Empty className="flex-1 border-none bg-transparent">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="bg-indigo-500/10 text-indigo-500 size-16 mb-4">
                    <Drone className="size-8" />
                  </EmptyMedia>
                  <EmptyTitle className="text-lg font-bold text-foreground/90">Clinical Intelligence</EmptyTitle>
                  <EmptyDescription className="text-sm max-w-[320px] leading-relaxed">
                    I'm listening to the consultation and analyzing clinical data in real-time. 
                    Ask me to check patient history, identify red flags, or draft complex documents.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground italic text-sm">
                 {/* TODO: Implement ChatMessageList component */}
                 Ready to assist with this conversation.
              </div>
            )}
            
            {/* High-Fidelity Chat Input Widget */}
            <div className="mt-auto">
               <ChatInput />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import * as React from "react"
import { ChatMessage } from "./chat-message"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import type { ChatMessage as ChatMessageType } from "../../types"

interface ChatMessageListProps {
  messages: ChatMessageType[]
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <NativeScroll 
      ref={scrollRef}
      className="flex-1 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 transition-colors"
    >
      <div className="flex flex-col pt-4 pb-12">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
    </NativeScroll>
  )
}

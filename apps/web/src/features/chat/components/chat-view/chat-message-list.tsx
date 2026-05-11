import * as React from "react"
import { ChatMessage } from "./chat-message"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import { useChatStore } from "../../stores/chat-store"
import type { ChatMessage as ChatMessageType } from "../../types"

interface ChatMessageListProps {
  messages: ChatMessageType[]
  mode?: 'sidecar' | 'workspace'
}

export function ChatMessageList({ messages, mode = 'workspace' }: ChatMessageListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const streamingStatusMessage = useChatStore((s) => s.streamingStatusMessage)

  const hasStreamingContent = messages.some(
    (m) => m.isStreaming && m.content.length > 0
  )
  const showThinking = streamingStatusMessage !== "" && !hasStreamingContent

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, showThinking])

  return (
    <NativeScroll
      ref={scrollRef}
      className="flex-1 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 transition-colors"
    >
      <div className="flex flex-col pt-4 pb-48">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} mode={mode} />
        ))}
        {showThinking && (
          <div className="flex justify-center py-4">
            <div className="w-full max-w-3xl px-4 flex items-center gap-2 text-muted-foreground text-sm">
              <div className="size-2 rounded-full bg-muted-foreground/40 animate-pulse shadow-[0_0_8px_rgba(163,163,163,0.8)]" />
              <span className="text-muted-foreground/70 animate-pulse">
                {streamingStatusMessage || "Thinking..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </NativeScroll>
  )
}

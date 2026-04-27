import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import type { ChatMessage as ChatMessageType } from "../../types"

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className="flex w-full py-2 justify-center">
      <div className={cn(
        "max-w-3xl w-full px-4 flex",
        isAssistant ? "justify-start" : "justify-end"
      )}>
        <div className={cn(
          "flex flex-col",
          isAssistant ? "w-full pr-4 sm:pr-8" : "max-w-[80%] items-end"
        )}>
          <div className={cn(
            "text-[15px] leading-relaxed",
            isAssistant 
              ? cn(
                  "bg-transparent text-slate-800 dark:text-slate-200 max-w-none w-full overflow-x-auto px-1 py-2",
                  "[&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/20 [&::-webkit-scrollbar-thumb:hover]:bg-border/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden",
                  "[&_strong]:font-semibold [&_em]:italic",
                  "[&_h1]:text-lg [&_h1]:font-bold [&_h1]:my-4",
                  "[&_h2]:text-base [&_h2]:font-bold [&_h2]:my-3",
                  "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:my-3",
                  "[&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_table]:my-4",
                  "[&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-muted/50",
                  "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
                  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
                  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
                  "[&_li]:my-1",
                  "[&_cite]:text-[10px] [&_cite]:bg-primary/10 [&_cite]:text-primary [&_cite]:px-1.5 [&_cite]:py-0.5 [&_cite]:rounded-full [&_cite]:mx-0.5 [&_cite]:font-medium [&_cite]:not-italic [&_cite]:cursor-pointer hover:[&_cite]:bg-primary/20"
                )
              : "bg-primary text-primary-foreground shadow-xs w-fit rounded-xl whitespace-pre-wrap px-4 py-2" 
          )}>
            {isAssistant ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              message.content
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

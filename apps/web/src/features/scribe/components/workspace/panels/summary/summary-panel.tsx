import * as React from "react"
import { 
  Copy, 
  CircleCheck,
  PenLine
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import { Button } from "@workspace/ui/components/button"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import type { Consultation } from "@workspace/features/scribe/types"
import { cn } from "@workspace/ui/lib/utils"
import { stripMarkdown, markdownToHtml } from "@/shared/utils/markdown"

export interface SummaryPanelProps {
  consultation: Consultation
}

export function SummaryPanel({ consultation }: SummaryPanelProps) {
  const [isCopied, setIsCopied] = React.useState(false)
  const content = consultation.summary || ""

  const handleCopy = async () => {
    const plainText = stripMarkdown(content)
    const htmlText = markdownToHtml(content)

    if (!plainText) return

    try {
      const typeText = "text/plain"
      const typeHtml = "text/html"
      const blobText = new Blob([plainText], { type: typeText })
      const blobHtml = new Blob([htmlText], { type: typeHtml })

      const data = [new ClipboardItem({
        [typeText]: blobText,
        [typeHtml]: blobHtml,
      })]

      await navigator.clipboard.write(data)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      try {
        await navigator.clipboard.writeText(plainText)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (fallbackErr) {
        console.error("Failed to copy text: ", fallbackErr)
      }
    }
  }

  return (
    <div className="border rounded-lg bg-background h-full flex flex-col overflow-hidden relative group/panel">
      
      {/* Persistent Action Bar */}
      <div className="absolute top-0 right-0 flex items-center justify-end px-4 pt-3 z-20">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-200 shadow-xs bg-background/50"
          onClick={handleCopy}
          title="Copy summary text"
        >
          <div className="relative h-4 w-4">
            <Copy className={cn(
              "absolute inset-0 h-4 w-4 transition-all duration-300 transform",
              isCopied ? "opacity-0 scale-75 rotate-45" : "opacity-100 scale-100 rotate-0"
            )} />
            <CircleCheck className={cn(
              "absolute inset-0 h-4 w-4 text-green-600 transition-all duration-300 transform",
              isCopied ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-45"
            )} />
          </div>
        </Button>
      </div>

      {content ? (
        <NativeScroll className="flex-1 min-h-0">
          <div className="px-8 md:px-10 pt-10 pb-8">
            <div className="text-[15px] leading-relaxed text-foreground/90">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="text-[14px] font-bold text-foreground mt-6 mb-2 uppercase tracking-wide" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-[14px] font-bold text-foreground mt-6 mb-2 uppercase tracking-wide" {...props} />,
                  p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-3 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  strong: ({node, ...props}) => <span className="font-bold text-foreground" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </NativeScroll>
      ) : (
        <div className="flex items-center justify-center flex-1 p-8">
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-blue-500/10 text-blue-500">
                <PenLine className="w-5 h-5" />
              </EmptyMedia>
              <EmptyTitle>No Summary Yet</EmptyTitle>
              <EmptyDescription>
                A clinical summary will be generated once the session is complete.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  )
}

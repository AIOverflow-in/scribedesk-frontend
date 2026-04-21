import { ScrollArea } from "@workspace/ui/components/scroll-area"
import type { Consultation } from "@workspace/features/scribe/types"

export interface SummaryPanelProps {
  consultation: Consultation
}

export function SummaryPanel({ consultation }: SummaryPanelProps) {
  return (
    <div className="border rounded-lg p-4 bg-background">
      {consultation.summary ? (
        <ScrollArea className="h-[500px]">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{consultation.summary}</p>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          <p className="text-sm">No summary available yet</p>
        </div>
      )}
    </div>
  )
}

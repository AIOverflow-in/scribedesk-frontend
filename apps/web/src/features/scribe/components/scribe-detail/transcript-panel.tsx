import { ScrollArea } from "@workspace/ui/components/scroll-area"
import type { Consultation } from "@workspace/features/scribe/types"

export interface TranscriptPanelProps {
  consultation: Consultation
}

export function TranscriptPanel({ consultation }: TranscriptPanelProps) {
  return (
    <div className="border rounded-lg p-4 bg-background">
      {consultation.transcript ? (
        <ScrollArea className="h-[500px]">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{consultation.transcript}</p>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          <p className="text-sm">No transcript available yet</p>
        </div>
      )}
    </div>
  )
}

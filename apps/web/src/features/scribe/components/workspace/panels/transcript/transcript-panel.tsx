import { AudioLines } from "lucide-react"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import type { Consultation } from "@workspace/features/scribe/types"

export interface TranscriptPanelProps {
  consultation: Consultation
}

export function TranscriptPanel({ consultation }: TranscriptPanelProps) {
  return (
    <div className="border rounded-lg bg-background h-full flex flex-col overflow-hidden">
      {consultation.transcript ? (
        <ScrollArea className="flex-1">
          <div className="p-6 prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
              {consultation.transcript}
            </p>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center flex-1 p-8">
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-red-500/10 text-red-500">
                <AudioLines />
              </EmptyMedia>
              <EmptyTitle>No Transcript Available</EmptyTitle>
              <EmptyDescription>
                The consultation transcript will appear here once the processing is complete.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  )
}

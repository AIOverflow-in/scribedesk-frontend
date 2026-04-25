import { PenLine } from "lucide-react"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import type { Consultation } from "@workspace/features/scribe/types"

export interface SummaryPanelProps {
  consultation: Consultation
}

export function SummaryPanel({ consultation }: SummaryPanelProps) {
  return (
    <div className="border rounded-lg bg-background h-full flex flex-col overflow-hidden">
      {consultation.summary ? (
        <ScrollArea className="flex-1">
          <div className="p-6 prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
              {consultation.summary}
            </p>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center flex-1 p-8">
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-blue-500/10 text-blue-500">
                <PenLine />
              </EmptyMedia>
              <EmptyTitle>No Summary Yet</EmptyTitle>
              <EmptyDescription>
                A concise clinical summary will be generated once the transcript is finalized.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  )
}

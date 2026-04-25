import { Inbox } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface ScribeEmptyStateProps {
  className?: string
}

export function ScribeEmptyState({ className }: ScribeEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full w-full px-6 text-center",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-1">No Consultation Selected</h3>
      <p className="text-sm text-muted-foreground max-w-[240px]">
        Select a consultation from the list to view details, transcript, and
        reports
      </p>
    </div>
  )
}

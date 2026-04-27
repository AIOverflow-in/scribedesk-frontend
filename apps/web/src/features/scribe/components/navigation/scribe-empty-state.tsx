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
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary shadow-xs">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold mb-1 text-foreground/90">No Consultation Selected</h3>
      <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
        Select a consultation from the list to view details, transcript, and
        reports.
      </p>
    </div>
  )
}

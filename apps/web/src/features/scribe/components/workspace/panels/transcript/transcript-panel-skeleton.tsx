import { cn } from "@workspace/ui/lib/utils"
import { Skeleton } from "@workspace/ui/components/skeleton"

export function TranscriptPanelSkeleton() {
  return (
    <div className="border rounded-lg bg-background h-full flex flex-col overflow-hidden animate-pulse">
      <div className="flex-1 p-6 space-y-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className={cn("h-4", i % 2 === 0 ? "w-[85%]" : "w-[70%]")} />
          </div>
        ))}
      </div>
    </div>
  )
}

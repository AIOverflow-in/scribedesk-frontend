import { cn } from "@workspace/ui/lib/utils"
import { Skeleton } from "@workspace/ui/components/skeleton"

const BLOCKS = [
  { label: "0:12", lines: ["w-[72%]", "w-[55%]"] },
  { label: "0:21", lines: ["w-[82%]", "w-[28%]"] },
  { label: "0:30", lines: ["w-[60%]"] },
  { label: "0:35", lines: ["w-[70%]", "w-[20%]"] },
  { label: "0:42", lines: ["w-[75%]", "w-[45%]"] },
  { label: "0:48", lines: ["w-[65%]"] },
  { label: "0:55", lines: ["w-[30%]"] },
  { label: "1:02", lines: ["w-[88%]", "w-[50%]"] },
  { label: "1:10", lines: ["w-[85%]", "w-[40%]"] },
  { label: "1:18", lines: ["w-[72%]", "w-[90%]"] },
  { label: "1:25", lines: ["w-[25%]"] },
  { label: "1:30", lines: ["w-[78%]", "w-[35%]"] },
]

export function TranscriptPanelSkeleton() {
  return (
    <div className="border rounded-lg bg-background h-full flex flex-col overflow-hidden animate-pulse">
      <div className="flex-1 p-6 space-y-5">
        {BLOCKS.map((block, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-10 rounded-sm" />
            {block.lines.map((width, j) => (
              <Skeleton key={j} className={cn("h-[15px]", width)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}



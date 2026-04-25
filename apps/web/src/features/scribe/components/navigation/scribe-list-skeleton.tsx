import { Skeleton } from "@workspace/ui/components/skeleton"

export function ScribeListSkeleton() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header Skeleton */}
      <div className="px-3 space-y-2 mb-4">
        <div className="flex justify-end gap-1 pt-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
      </div>

      {/* List Items Skeleton */}
      <div className="flex-1 space-y-0 divide-y border-t">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-3 space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-[80%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

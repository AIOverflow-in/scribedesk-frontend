import { Skeleton } from "@workspace/ui/components/skeleton"

export function ScribeDetailSkeleton() {
  return (
    <div className="flex flex-col h-full w-full px-4 pt-2 pb-4 gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="flex gap-4 border-b pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Transcript Buttons Skeleton */}
        <div className="flex-1 border rounded-lg p-6 bg-background">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

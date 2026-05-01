import { Skeleton } from "@workspace/ui/components/skeleton"

export function HistoryDetailSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-4 p-6 md:p-8">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
      <div className="pt-2">
        <Skeleton className="h-4 w-1/4 mb-3" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="pt-2">
        <Skeleton className="h-4 w-1/5 mb-3" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

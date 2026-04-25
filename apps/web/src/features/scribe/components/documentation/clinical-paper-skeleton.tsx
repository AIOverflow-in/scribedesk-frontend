import { Skeleton } from "@workspace/ui/components/skeleton"

export function ClinicalPaperSkeleton() {
  return (
    <div className="w-full max-w-[850px] bg-white shadow-sm border rounded-sm flex flex-col h-full animate-pulse">
      {/* Fixed Header Skeleton */}
      <div className="shrink-0 py-4 px-8 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2 w-20" />
          </div>
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="flex-1 p-8 md:p-10 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-1 w-12 rounded-full" />
        </div>

        <div className="space-y-4 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
          
          <div className="pt-8 space-y-4">
             <Skeleton className="h-4 w-[40%]" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-[95%]" />
          </div>

          <div className="pt-8 space-y-4">
             <Skeleton className="h-4 w-[30%]" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>

        {/* Signature Area Skeleton */}
        <div className="mt-12 w-40 border-t border-gray-100 pt-2 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>

      {/* Fixed Footer Skeleton */}
      <div className="shrink-0 p-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-end">
        <div className="space-y-1">
          <Skeleton className="h-2 w-24" />
          <Skeleton className="h-2 w-32" />
        </div>
        <Skeleton className="h-2 w-20" />
      </div>
    </div>
  )
}

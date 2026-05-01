import { PenLine } from "lucide-react"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@workspace/ui/components/empty"

export function HistoryDetailEmpty() {
  return (
    <Empty className="flex-1 min-h-[400px] py-16 bg-transparent border border-dashed rounded-xl flex items-center justify-center">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-blue-500/10 text-blue-500">
          <PenLine className="w-5 h-5" />
        </EmptyMedia>
        <EmptyTitle>No Summary Available</EmptyTitle>
        <EmptyDescription>This consultation doesn't have a generated summary.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

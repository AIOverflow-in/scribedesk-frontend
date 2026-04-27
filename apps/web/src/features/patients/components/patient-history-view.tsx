import { GalleryVerticalEnd } from "lucide-react"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import { HistoryTimeline } from "@/shared/components/consultation-history/history-timeline"

interface PatientHistoryViewProps {
  history: any[]
}

export function PatientHistoryView({ history }: PatientHistoryViewProps) {
  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border rounded-xl border-dashed bg-muted/5">
        <Empty className="bg-transparent border-none shadow-none">
          <EmptyHeader className="items-center">
            <EmptyMedia variant="icon" className="size-16 bg-muted text-primary shadow-none border-none">
              <GalleryVerticalEnd className="size-8" />
            </EmptyMedia>
            <EmptyTitle className="text-lg mt-4">No History Found</EmptyTitle>
            <EmptyDescription className="text-sm">
              This patient hasn't had any clinical consultations recorded yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="flex-1 border rounded-xl overflow-hidden bg-card shadow-xs">
      <HistoryTimeline history={history} />
    </div>
  )
}

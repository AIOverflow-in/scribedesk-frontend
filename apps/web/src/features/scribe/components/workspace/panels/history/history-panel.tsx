import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { useScribeSessions } from "../../../../hooks/use-scribe-sessions"
import { Spinner } from "@workspace/ui/components/spinner"
import type { Consultation } from "@workspace/features/scribe/types"
import type { SessionListItem } from "@workspace/schemas/session"
import { HistoryTimeline } from "@/shared/components/consultation-history/history-timeline"

function mapToConsultation(session: SessionListItem): Consultation {
  return {
    id: session.id,
    title: session.title,
    patient: {
      id: session.patient_id ?? "",
      name: session.patient_name ?? "Unknown Patient",
      age: session.patient_age ?? 0,
      gender: session.patient_gender ?? "unknown",
    },
    date: session.created_at,
    description: session.description ?? "",
    status: session.status as Consultation["status"],
  }
}

export interface HistoryPanelProps {
  consultation: Consultation
}

export function HistoryPanel({ consultation }: HistoryPanelProps) {
  const navigate = useNavigate()
  const { data: sessionsData, isLoading } = useScribeSessions({ page: 1, pageSize: 100 })

  const patientHistory = React.useMemo(() => {
    if (!sessionsData?.items) return []
    const patientId = consultation.patient.id
    return (sessionsData.items as SessionListItem[])
      .filter(s => s.patient_id === patientId)
      .map(mapToConsultation)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [sessionsData, consultation.patient.id])

  const handleSelectSession = (sessionId: string) => {
    navigate({ to: "/scribe", search: { id: sessionId } as any })
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background rounded-lg border">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background rounded-lg border overflow-hidden">
      <HistoryTimeline
        history={patientHistory}
        currentConsultationId={consultation.id}
        onSelectSession={handleSelectSession}
      />
    </div>
  )
}

import * as React from "react"
import { mockConsultations } from "../../../../data/mock-consultations"
import type { Consultation } from "@workspace/features/scribe/types"
import { HistoryTimeline } from "@/shared/components/consultation-history/history-timeline"

export interface HistoryPanelProps {
  consultation: Consultation
}

export function HistoryPanel({ consultation }: HistoryPanelProps) {
  const patientHistory = mockConsultations
    .filter(c => c.patient.id === consultation.patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="h-full flex flex-col bg-background rounded-lg border overflow-hidden">
      <HistoryTimeline 
        history={patientHistory} 
        currentConsultationId={consultation.id} 
      />
    </div>
  )
}

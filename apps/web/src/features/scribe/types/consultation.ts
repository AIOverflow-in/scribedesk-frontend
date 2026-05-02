export type ConsultationStatus = "draft" | "in-progress" | "active" | "completed" | "archived"

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
}

export interface Consultation {
  id: string
  title: string
  patient: Patient
  date: string
  description: string
  duration?: number  // in minutes
  status: ConsultationStatus
  transcript?: string
  summary?: string
  reports?: Report[]
}

export interface Report {
  id: string
  title: string
  type: string
  createdAt: string
  content?: string
}

import type { SessionResponse, SessionListItem } from "@workspace/schemas/session"

export function mapSessionToConsultation(session: SessionResponse | SessionListItem): Consultation {
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
    duration: session.total_audio_seconds ? Math.round(session.total_audio_seconds / 60) : undefined,
    status: session.status as Consultation["status"],
    summary: "clinical_summary" in session ? session.clinical_summary ?? undefined : undefined,
    reports: "reports" in session
      ? (session.reports ?? []).map((r: any) => ({
          id: r.id,
          title: r.title,
          type: r.template_name ?? "Unknown",
          createdAt: r.created_at,
        }))
      : undefined,
  }
}

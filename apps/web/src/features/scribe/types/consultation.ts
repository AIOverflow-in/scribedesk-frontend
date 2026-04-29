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

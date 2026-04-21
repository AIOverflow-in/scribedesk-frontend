export type ConsultationStatus = "draft" | "in-progress" | "completed" | "archived"

export interface Patient {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
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

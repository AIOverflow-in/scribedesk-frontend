export interface Patient {
  id: string
  identifier: string // EHR ID, etc.
  name: string
  email: string
  dob: string
  gender: "male" | "female" | "other"
  bloodGroup: string
  age: number
  avatar?: string
}

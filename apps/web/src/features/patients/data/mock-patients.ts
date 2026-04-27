import type { Patient } from "../types/patient"

export const mockPatients: Patient[] = [
  {
    id: "p1",
    identifier: "EHR-2024-001",
    name: "John Doe",
    email: "john.doe@example.com",
    dob: "1979-05-15",
    gender: "male",
    bloodGroup: "O+",
    age: 45,
  },
  {
    id: "p2",
    identifier: "EHR-2024-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    dob: "1992-08-20",
    gender: "female",
    bloodGroup: "A-",
    age: 32,
  },
  {
    id: "p3",
    identifier: "EHR-2024-003",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    dob: "1965-11-02",
    gender: "male",
    bloodGroup: "B+",
    age: 59,
  },
  {
    id: "p4",
    identifier: "EHR-2024-004",
    name: "Emily Brown",
    email: "emily.brown@example.com",
    dob: "1988-03-12",
    gender: "female",
    bloodGroup: "AB+",
    age: 36,
  },
  {
    id: "p5",
    identifier: "EHR-2024-005",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    dob: "1975-09-30",
    gender: "male",
    bloodGroup: "O-",
    age: 49,
  }
]

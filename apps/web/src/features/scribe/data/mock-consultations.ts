import type { Consultation } from "../types"

export const mockConsultations: Consultation[] = [
  {
    id: "1",
    title: "Annual Checkup",
    patient: {
      id: "p1",
      name: "John Doe",
      age: 45,
      gender: "male",
    },
    date: "2024-01-15",
    description: "Routine annual health checkup including physical examination, blood pressure monitoring, cholesterol screening, and discussion about lifestyle modifications. Patient reported mild fatigue but overall feeling well.",
    duration: 45,
    status: "completed",
    transcript: "Doctor: Good morning, John. How are you feeling today?\nPatient: I've been feeling generally well, just some occasional fatigue.\nDoctor: I see. Let's check your vitals and go through your regular checkup.\n...",
    summary: "Patient presented for annual checkup. Overall health is good with mild fatigue reported. Vitals within normal range. Recommended follow-up in 6 months.",
    reports: [
      {
        id: "r1",
        title: "Lab Results",
        type: "Medical Report",
        createdAt: "2024-01-15",
      },
      {
        id: "r2",
        title: "Prescription Summary",
        type: "Prescription",
        createdAt: "2024-01-15",
      },
    ],
  },
  {
    id: "2",
    title: "Follow-up Consultation",
    patient: {
      id: "p2",
      name: "Jane Smith",
      age: 32,
      gender: "female",
    },
    date: "2024-01-18",
    description: "Post-treatment follow-up to review recovery progress, discuss any ongoing symptoms, and adjust treatment plan if necessary. Patient responded well to initial treatment.",
    duration: 30,
    status: "in-progress",
    transcript: "",
    summary: "",
    reports: [],
  },
]

import * as React from "react"
import { User } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { usePatient } from "../hooks/use-patients"
import { useSessions } from "@workspace/hooks/session"
import { apiClient } from "@/lib/api-client"
import type { Patient } from "../types/patient"
import type { Consultation } from "@workspace/features/scribe/types"
import type { SessionListItem } from "@workspace/schemas"
import { PatientDetailsForm } from "./patient-details-form"
import { PatientHistoryView } from "./patient-history-view"

interface PatientDetailSheetProps {
  patient: Patient | null
  onClose: () => void
}

function mapSessionToConsultation(session: SessionListItem, patientName: string, patientAge: number, patientGender: string): Consultation {
  return {
    id: session.id,
    title: session.title,
    description: session.description ?? "",
    date: session.created_at,
    status: "completed",
    patient: {
      id: session.patient_id ?? "",
      name: patientName,
      age: patientAge,
      gender: patientGender as "male" | "female" | "other",
    },
  }
}

export function PatientDetailSheet({ patient, onClose }: PatientDetailSheetProps) {
  const lastPatient = React.useRef(patient)
  if (patient) lastPatient.current = patient
  const p = patient || lastPatient.current

  const { data: patientData } = usePatient(p?.id ?? "")
  const { data: sessionsData } = useSessions(apiClient, { page: 1, pageSize: 100, patientId: p?.id })

  const patientHistory = React.useMemo<Consultation[]>(() => {
    if (!p || !sessionsData?.items) return []
    const fullName = [patientData?.first_name, patientData?.last_name].filter(Boolean).join(" ") || [p.first_name, p.last_name].filter(Boolean).join(" ")
    return (sessionsData.items as SessionListItem[])
      .map((s: SessionListItem) =>
        mapSessionToConsultation(
          s,
          fullName,
          patientData?.date_of_birth
            ? new Date().getFullYear() - new Date(patientData.date_of_birth).getFullYear()
            : s.patient_age ?? 0,
          patientData?.gender ?? s.patient_gender ?? "other"
        )
      )
      .sort((a: Consultation, b: Consultation) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [p, sessionsData, patientData])

  if (!p) return null

  return (
    <Sheet open={!!patient} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[50vw]! sm:max-w-none! flex flex-col p-0 gap-0 overflow-hidden"
      >
        <SheetHeader className="p-6 pb-4 shrink-0 border-b">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="size-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <SheetTitle className="text-base font-semibold">{[p.first_name, p.last_name].filter(Boolean).join(" ")}</SheetTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <span className="capitalize">{p.gender ?? "Unknown"}</span>
                <span>•</span>
                <span>{patientData?.date_of_birth ? `${new Date().getFullYear() - new Date(patientData.date_of_birth).getFullYear()} years old` : ""}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4 shrink-0">
            <TabsList variant="line">
              <TabsTrigger value="details" className="text-base">
                Details
              </TabsTrigger>
              <TabsTrigger value="history" className="text-base">
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="flex-1 flex flex-col min-h-0 focus-visible:outline-none">
            <PatientDetailsForm patient={p} onCancel={onClose} />
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-hidden m-0 focus-visible:outline-none data-[state=active]:flex flex-col p-6 pt-2">
            <PatientHistoryView history={patientHistory} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

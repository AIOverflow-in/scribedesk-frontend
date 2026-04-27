import * as React from "react"
import { 
  User, 
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { mockConsultations } from "@/features/scribe/data/mock-consultations"
import type { Patient } from "../types/patient"
import { PatientDetailsForm } from "./patient-details-form"
import { PatientHistoryView } from "./patient-history-view"

interface PatientDetailSheetProps {
  patient: Patient | null
  onClose: () => void
}

export function PatientDetailSheet({ patient, onClose }: PatientDetailSheetProps) {
  // Preservation of data during exit animation
  const lastPatient = React.useRef(patient)
  if (patient) lastPatient.current = patient
  const p = patient || lastPatient.current

  const patientHistory = React.useMemo(() => {
    if (!p) return []
    return mockConsultations
      .filter(c => c.patient.id === p.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [p])

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
              <SheetTitle className="text-base font-semibold">{p.name}</SheetTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <span className="capitalize">{p.gender}</span>
                <span>•</span>
                <span>{p.age} years old</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4 shrink-0">
            <TabsList className="w-fit h-11 bg-muted/50 p-1 rounded-sm">
              <TabsTrigger value="details" className="px-6 cursor-pointer rounded-sm text-base font-medium">
                Details
              </TabsTrigger>
              <TabsTrigger value="history" className="px-6 cursor-pointer rounded-sm text-base font-medium">
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

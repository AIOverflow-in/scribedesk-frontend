import * as React from "react"
import { UserPlus, User } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { DashboardLayout } from "@/shared/layout/dashboard-layout"
import { PageHeader } from "@/shared/components/page-header"
import { mockPatients } from "../data/mock-patients"
import { PatientListItem } from "../components/patient-list-item"
import { PatientSearch } from "../components/patient-search"
import { PatientDetailSheet } from "../components/patient-detail-sheet"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import type { Patient } from "../types/patient"

export function PatientsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null)

  const filteredPatients = mockPatients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.identifier.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-8 py-10 gap-8">
        <PageHeader 
          title="Patients" 
          description="Manage patient records and view clinical histories."
          actions={
            <Button 
              className="gap-2 h-9 px-4 font-semibold shadow-sm cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Add Patient
            </Button>
          }
        >
          <PatientSearch value={searchQuery} onChange={setSearchQuery} />
        </PageHeader>

        {/* List Area */}
        <div className="flex-1 min-h-0">
          {filteredPatients.length > 0 ? (
            <ScrollArea className="flex-1">
              <div className="flex flex-col border-b border-border mb-10">
                {filteredPatients.map((patient) => (
                  <PatientListItem
                    key={patient.id}
                    patient={patient}
                    onClick={() => setSelectedPatient(patient)}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="py-20">
              <Empty className="border-none bg-transparent">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="size-16 bg-primary/10 text-primary shadow-xs">
                    <User className="size-8" />
                  </EmptyMedia>
                  <EmptyTitle className="text-lg">No patients found</EmptyTitle>
                  <EmptyDescription>
                    {searchQuery ? `No patients match "${searchQuery}"` : "You haven't added any patients yet."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>
      </div>

      <PatientDetailSheet 
        patient={selectedPatient} 
        onClose={() => setSelectedPatient(null)} 
      />
    </DashboardLayout>
  )
}

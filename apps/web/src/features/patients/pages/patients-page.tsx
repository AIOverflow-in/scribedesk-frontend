import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { UserPlus, User } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Spinner } from "@workspace/ui/components/spinner"
import { PageHeader } from "@/shared/components/page-header"
import { PatientListItem } from "../components/patient-list-item"
import { PatientSearch } from "../components/patient-search"
import { PatientDetailSheet } from "../components/patient-detail-sheet"
import { AddPatientModal } from "../components/add-patient-modal"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from "@workspace/ui/components/empty"
import { usePatients, useCreatePatient, useDeletePatient } from "../hooks/use-patients"
import type { Patient } from "../types/patient"
import type { CreatePatientRequest, PaginatedPatientsResponse } from "@workspace/schemas"
import { toast } from "@workspace/ui/components/sonner"

export function PatientsPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null)
  const [addModalOpen, setAddModalOpen] = React.useState(false)
  const [page] = React.useState(1)

  const { data, isLoading } = usePatients(page, 20)
  const createPatient = useCreatePatient()
  const deletePatient = useDeletePatient()

  const patients = (data as PaginatedPatientsResponse | undefined)?.items ?? []

  const filteredPatients = React.useMemo(() => {
    if (!searchQuery.trim()) return patients
    const q = searchQuery.toLowerCase()
    return patients.filter((p: Patient) =>
      (p.full_name?.toLowerCase().includes(q) ?? false) ||
      (p.email?.toLowerCase().includes(q) ?? false) ||
      (p.identifier?.toLowerCase().includes(q) ?? false)
    )
  }, [patients, searchQuery])

  const handleCreatePatient = (reqData: CreatePatientRequest) => {
    createPatient.mutate(reqData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["patients"] })
        toast.success("Patient added successfully")
        setAddModalOpen(false)
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to add patient")
      },
    })
  }

  const handleDeletePatient = (patientId: string) => {
    deletePatient.mutate(patientId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["patients"] })
        toast.success("Patient deleted")
        if (selectedPatient?.id === patientId) setSelectedPatient(null)
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to delete patient")
      },
    })
  }

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-8 py-10 gap-8">
      <PageHeader
        title="Patients"
        description="Manage patient records and view clinical histories."
        actions={
          <Button
            className="gap-2 h-9 px-4 font-semibold shadow-sm cursor-pointer"
            onClick={() => setAddModalOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Button>
        }
      >
        <PatientSearch value={searchQuery} onChange={setSearchQuery} />
      </PageHeader>

      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : filteredPatients.length > 0 ? (
          <ScrollArea className="flex-1">
            <div className="flex flex-col mb-10 [&>*:hover]:border-t-transparent [&>*:hover+*]:border-t-transparent [&>*:first-child]:border-t-0 *:border-t *:border-border">
              {filteredPatients.map((patient) => (
                <PatientListItem
                  key={patient.id}
                  patient={patient}
                  onClick={() => setSelectedPatient(patient)}
                  onDelete={handleDeletePatient}
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

      <PatientDetailSheet
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      <AddPatientModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAdd={handleCreatePatient}
      />
    </div>
  )
}

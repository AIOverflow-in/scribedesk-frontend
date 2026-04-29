import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription as DialogDesc
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty
} from "@workspace/ui/components/combobox"
import { useScribe } from "../../../context/scribe-context"
import { useUpdateScribeSession } from "../../../hooks/use-scribe-sessions"
import { usePatients } from "@workspace/hooks/patient"
import { apiClient } from "@/lib/api-client"

export function EditSessionModal() {
  const { isEditModalOpen, closeEditModal, consultation } = useScribe()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPatientName, setSelectedPatientName] = useState<string | null>(null)

  const updateSession = useUpdateScribeSession()
  const { data: patientsData } = usePatients(apiClient, 1, 200)

  const patients = patientsData?.items ?? []
  const patientNames = patients.map((p: any) => p.full_name ?? p.name)

  useEffect(() => {
    if (consultation) {
      setTitle(consultation.title)
      setDescription(consultation.description || "")
      setSelectedPatientName(consultation.patient.name === "Unknown Patient" ? null : consultation.patient.name)
    }
  }, [consultation, isEditModalOpen])

  const handleSave = () => {
    if (!consultation) return
    const patientId = patients.find((p: any) => (p.full_name ?? p.name) === selectedPatientName)?.id ?? null
    updateSession.mutate(
      {
        sessionId: consultation.id,
        data: {
          title: title || undefined,
          description: description || undefined,
          patient_id: patientId || undefined,
        },
      },
      { onSuccess: () => closeEditModal() }
    )
  }

  return (
    <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && closeEditModal()}>
      <DialogContent
        className="sm:max-w-[425px] overflow-visible"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDesc>
            Update the title and patient association for this clinical session.
          </DialogDesc>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Initial Consultation"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="patient">Patient</Label>
            <Combobox
              items={patientNames}
              value={selectedPatientName}
              onValueChange={(val: any) => setSelectedPatientName(val)}
            >
              <ComboboxInput
                id="patient"
                placeholder="Select a patient..."
                showClear={true}
                className="w-full"
              />
              <ComboboxContent className="w-[--anchor-width]">
                <ComboboxEmpty>No patients found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some notes or description for this session..."
              className="max-h-32 overflow-y-auto"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeEditModal} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSave} className="cursor-pointer" disabled={updateSession.isPending}>
            {updateSession.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

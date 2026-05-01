import { useState, useEffect, useCallback, useRef } from "react"
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
  const { data: patientsData } = usePatients(apiClient, { page: 1, pageSize: 200 })

  const patients = patientsData?.items ?? []
  const patientNames = patients.map((p: any) =>
    [p.first_name, p.last_name].filter(Boolean).join(" ")
  )

  useEffect(() => {
    if (consultation) {
      setTitle(consultation.title)
      setDescription(consultation.description || "")
      setSelectedPatientName(consultation.patient.name === "Unknown Patient" ? null : consultation.patient.name)
    }
  }, [consultation, isEditModalOpen])

  const patientFilter = (name: string, query: string) => {
    const parts = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return true
    const normalized = name.toLowerCase().replace(/\s+/g, " ").trim()
    return parts.every((part) => normalized.includes(part))
  }

  const handleSave = () => {
    if (!consultation) return
    const patientId = patients.find((p: any) =>
      [p.first_name, p.last_name].filter(Boolean).join(" ") === selectedPatientName
    )?.id ?? null
    updateSession.mutate(
      {
        sessionId: consultation.id,
        data: {
          title: title || undefined,
          description: description || undefined,
          patient_id: patientId,
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
              filter={patientFilter}
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

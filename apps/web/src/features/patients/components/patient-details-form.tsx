import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  User,
  Mail,
  Fingerprint,
  Calendar,
  Droplet
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { useUpdatePatient } from "../hooks/use-patients"
import type { Patient } from "../types/patient"
import type { UpdatePatientRequest } from "@workspace/schemas"
import { toast } from "@workspace/ui/components/sonner"

interface PatientDetailsFormProps {
  patient: Patient
  onCancel: () => void
}

export function PatientDetailsForm({ patient, onCancel }: PatientDetailsFormProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = React.useState<Patient>(patient)

  React.useEffect(() => {
    setFormData(patient)
  }, [patient.id])

  const isDirty = React.useMemo(() => {
    return (
      formData.full_name !== patient.full_name ||
      formData.email !== patient.email ||
      formData.identifier !== patient.identifier ||
      formData.date_of_birth !== patient.date_of_birth ||
      formData.gender !== patient.gender ||
      formData.blood_group !== patient.blood_group
    )
  }, [formData, patient])

  const updatePatient = useUpdatePatient()

  const handleInputChange = (key: keyof Patient, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const data: UpdatePatientRequest = {}
    if (formData.full_name !== patient.full_name) data.full_name = formData.full_name
    if (formData.email !== patient.email) data.email = formData.email
    if (formData.identifier !== patient.identifier) data.identifier = formData.identifier
    if (formData.date_of_birth !== patient.date_of_birth) data.date_of_birth = formData.date_of_birth
    if (formData.gender !== patient.gender) data.gender = formData.gender
    if (formData.blood_group !== patient.blood_group) data.blood_group = formData.blood_group

    updatePatient.mutate(
      { patientId: patient.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["patients"] })
          queryClient.invalidateQueries({ queryKey: ["patient", patient.id] })
          toast.success("Patient updated successfully")
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to update patient")
        },
      }
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <User className="size-3.5 text-primary" /> Full name
              </FieldLabel>
              <Input
                className="rounded-md"
                value={formData.full_name ?? ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" /> Email address
              </FieldLabel>
              <Input
                type="email"
                className="rounded-md"
                value={formData.email ?? ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Fingerprint className="size-3.5 text-primary" /> Patient ID
              </FieldLabel>
              <Input
                className="rounded-md"
                value={formData.identifier ?? ""}
                onChange={(e) => handleInputChange("identifier", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" /> Date of birth
              </FieldLabel>
              <Input
                type="date"
                className="rounded-md"
                value={formData.date_of_birth ?? ""}
                onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <User className="size-3.5 text-primary" /> Gender
              </FieldLabel>
              <Input
                value={formData.gender ?? ""}
                className="capitalize rounded-md"
                onChange={(e) => handleInputChange("gender", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Droplet className="size-3.5 text-primary" /> Blood group
              </FieldLabel>
              <Input
                value={formData.blood_group ?? ""}
                className="rounded-md"
                onChange={(e) => handleInputChange("blood_group", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="p-4 border-t flex justify-end gap-3 bg-muted/5 shrink-0">
        <Button
          variant="outline"
          onClick={onCancel}
          size="sm"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={!isDirty || updatePatient.isPending}
          onClick={handleSave}
        >
          {updatePatient.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  )
}

import * as React from "react"
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
import type { Patient } from "../types/patient"

interface PatientDetailsFormProps {
  patient: Patient
  onCancel: () => void
}

export function PatientDetailsForm({ patient, onCancel }: PatientDetailsFormProps) {
  const [formData, setFormData] = React.useState<Patient>(patient)

  // Reset form only when the patient ID actually changes
  React.useEffect(() => {
    setFormData(patient)
  }, [patient.id])

  // Real Dirty Check: compare current form state with initial props
  const isDirty = React.useMemo(() => {
    return (
      formData.name !== patient.name ||
      formData.email !== patient.email ||
      formData.identifier !== patient.identifier ||
      formData.dob !== patient.dob ||
      formData.gender !== patient.gender ||
      formData.bloodGroup !== patient.bloodGroup
    )
  }, [formData, patient])

  const handleInputChange = (key: keyof Patient, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
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
                value={formData.name} 
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" /> Email address
              </FieldLabel>
              <Input 
                type="email" 
                className="rounded-md"
                value={formData.email} 
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Fingerprint className="size-3.5 text-primary" /> Patient ID
              </FieldLabel>
              <Input 
                className="rounded-md"
                value={formData.identifier} 
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
                value={formData.dob} 
                onChange={(e) => handleInputChange("dob", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <User className="size-3.5 text-primary" /> Gender
              </FieldLabel>
              <Input 
                value={formData.gender} 
                className="capitalize rounded-md"
                onChange={(e) => handleInputChange("gender", e.target.value as any)}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Droplet className="size-3.5 text-primary" /> Blood group
              </FieldLabel>
              <Input 
                value={formData.bloodGroup} 
                className="rounded-md"
                onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
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
          disabled={!isDirty}
        >
          Save Changes
        </Button>
      </div>
    </>
  )
}

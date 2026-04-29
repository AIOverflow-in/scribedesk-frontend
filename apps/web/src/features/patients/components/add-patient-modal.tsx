import * as React from "react"
import { User, Mail, Fingerprint, Calendar, Droplet } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { CreatePatientRequest } from "@workspace/schemas"

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const GENDERS = ["male", "female", "other"] as const

interface AddPatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: CreatePatientRequest) => void
}

export function AddPatientModal({ open, onOpenChange, onAdd }: AddPatientModalProps) {
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [ehrId, setEhrId] = React.useState("")
  const [gender, setGender] = React.useState<"male" | "female" | "other" | "">("")
  const [bloodGroup, setBloodGroup] = React.useState("")
  const [dob, setDob] = React.useState("")

  const isValid = firstName && gender

  const handleAdd = () => {
    if (!isValid) return
    onAdd({
      full_name: lastName ? `${firstName} ${lastName}` : firstName,
      email: email || undefined,
      identifier: ehrId || undefined,
      date_of_birth: dob || undefined,
      gender,
      blood_group: bloodGroup || undefined,
    })
    setFirstName("")
    setLastName("")
    setEmail("")
    setEhrId("")
    setGender("")
    setBloodGroup("")
    setDob("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden [&>button]:cursor-pointer">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-bold">Add New Patient</DialogTitle>
          <p className="text-sm text-muted-foreground">Enter the patient's information to create a new record.</p>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" /> First name
                </FieldLabel>
                <Input
                  className="rounded-md"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" /> Last name
                </FieldLabel>
                <Input
                  className="rounded-md"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" /> Email address
              </FieldLabel>
              <Input
                type="email"
                className="rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
              />
            </Field>

            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Fingerprint className="size-3.5 text-primary" /> EHR ID
              </FieldLabel>
              <Input
                className="rounded-md"
                value={ehrId}
                onChange={(e) => setEhrId(e.target.value)}
                placeholder="EHR-001234"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" /> Gender
                </FieldLabel>
                <Select value={gender} onValueChange={(v) => setGender(v as typeof GENDERS[number])}>
                  <SelectTrigger className="rounded-md">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g} className="capitalize">
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                  <Droplet className="size-3.5 text-primary" /> Blood group
                </FieldLabel>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="rounded-md">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" /> Date of birth
              </FieldLabel>
              <Input
                type="date"
                className="rounded-md"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="p-4 flex justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!isValid}
            onClick={handleAdd}
          >
            Add Patient
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

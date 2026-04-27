import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { PersonalDetails } from "../../types"

interface StepPersonalProps {
  data: PersonalDetails
  onChange: (data: PersonalDetails) => void
  onNext: () => void
}

export function StepPersonal({ data, onChange, onNext }: StepPersonalProps) {
  const handleChange = (key: keyof PersonalDetails, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>First name</FieldLabel>
          <Input
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="John"
          />
        </Field>
        <Field>
          <FieldLabel>Last name</FieldLabel>
          <Input
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Doe"
          />
        </Field>
      </div>

      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="john@example.com"
        />
      </Field>

      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input
          type="password"
          value={data.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Create a password"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Date of birth</FieldLabel>
          <Input
            type="date"
            value={data.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Gender</FieldLabel>
          <Select value={data.gender} onValueChange={(v) => handleChange("gender", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel>Speciality</FieldLabel>
        <Input
          value={data.speciality}
          onChange={(e) => handleChange("speciality", e.target.value)}
          placeholder="e.g. General Medicine"
        />
      </Field>

      <Button onClick={onNext}>Continue to Clinic Details</Button>
    </div>
  )
}

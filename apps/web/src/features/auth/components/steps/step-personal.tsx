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
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface StepPersonalProps {
  data: PersonalDetails
  onChange: (data: PersonalDetails) => void
  onNext: () => void
  errors?: Record<string, string>
}

export function StepPersonal({ data, onChange, onNext, errors = {} }: StepPersonalProps) {
  const [showPassword, setShowPassword] = useState(false)

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
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
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
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </Field>

      <Field>
        <FieldLabel>Password</FieldLabel>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={data.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Create a password (min 8 characters)"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
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

      <Button type="button" onClick={onNext}>Continue to Clinic Details</Button>
    </div>
  )
}
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
import { SPECIALITIES } from "@workspace/schemas"

interface StepPersonalProps {
  data: PersonalDetails
  onChange: (data: PersonalDetails) => void
  onNext: () => void
  errors?: Record<string, string>
  hideEmail?: boolean
  hidePassword?: boolean
  disableEmail?: boolean
}

export function StepPersonal({ data, onChange, onNext, errors = {}, hideEmail, hidePassword, disableEmail }: StepPersonalProps) {
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

      {!hideEmail && (
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
            disabled={disableEmail}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </Field>
      )}

      {!hidePassword && (
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
      )}

      <div className="grid grid-cols-2 gap-4">
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
        <Field>
          <FieldLabel>Speciality</FieldLabel>
          <Select value={data.speciality} onValueChange={(v) => handleChange("speciality", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select speciality" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALITIES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Button type="button" onClick={onNext}>Continue to Clinic Details</Button>
    </div>
  )
}
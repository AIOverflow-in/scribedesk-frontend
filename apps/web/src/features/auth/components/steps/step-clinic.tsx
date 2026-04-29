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
import type { ClinicDetails } from "../../types"

interface StepClinicProps {
  data: ClinicDetails
  onChange: (data: ClinicDetails) => void
  onBack: () => void
  onSubmit: () => void
  isPending?: boolean
  errors?: Record<string, string>
}

export function StepClinic({ data, onChange, onBack, onSubmit, isPending, errors = {} }: StepClinicProps) {
  const handleChange = (key: keyof ClinicDetails, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="flex flex-col gap-5">
      <Field>
        <FieldLabel>Clinic name</FieldLabel>
        <Input
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Mitchell Family Medicine"
        />
        {errors["clinic.name"] && <p className="text-sm text-destructive">{errors["clinic.name"]}</p>}
      </Field>

      <Field>
        <FieldLabel>Street address</FieldLabel>
        <Input
          value={data.street}
          onChange={(e) => handleChange("street", e.target.value)}
          placeholder="742 Evergreen Terrace"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>City</FieldLabel>
          <Input
            value={data.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Springfield"
          />
        </Field>
        <Field>
          <FieldLabel>State</FieldLabel>
          <Input
            value={data.state}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="Oregon"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Pincode</FieldLabel>
          <Input
            value={data.pincode}
            onChange={(e) => handleChange("pincode", e.target.value)}
            placeholder="97477"
          />
        </Field>
        <Field>
          <FieldLabel>Country</FieldLabel>
          <Select value={data.country || ""} onValueChange={(v) => handleChange("country", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="IN">India</SelectItem>
            </SelectContent>
          </Select>
          {errors["clinic.country"] && <p className="text-sm text-destructive">{errors["clinic.country"]}</p>}
        </Field>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} type="button">
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1" disabled={isPending}>
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </div>
  )
}
import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { mockClinic } from "../../data/mock-user"

export function ClinicSettings() {
  const [formData, setFormData] = React.useState(mockClinic)

  const isDirty = React.useMemo(() => {
    return (
      formData.name !== mockClinic.name ||
      formData.street !== mockClinic.street ||
      formData.city !== mockClinic.city ||
      formData.state !== mockClinic.state ||
      formData.pincode !== mockClinic.pincode ||
      formData.country !== mockClinic.country
    )
  }, [formData])

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCancel = () => {
    setFormData(mockClinic)
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-md">
      <div className="flex items-center gap-4">
        <img
          src={formData.photo}
          alt={formData.name}
          className="h-16 w-16 rounded-full object-cover border border-muted"
        />
        <div className="flex-1">
          <FieldLabel className="text-muted-foreground font-medium text-xs mb-1.5 block">
            Clinic name
          </FieldLabel>
          <Input
            className="rounded-md"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
      </div>

      <Field>
        <FieldLabel className="text-muted-foreground font-medium text-xs">
          Street address
        </FieldLabel>
        <Input
          className="rounded-md"
          value={formData.street}
          onChange={(e) => handleInputChange("street", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            City
          </FieldLabel>
          <Input
            className="rounded-md"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            State
          </FieldLabel>
          <Input
            className="rounded-md"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Pincode
          </FieldLabel>
          <Input
            className="rounded-md"
            value={formData.pincode ?? ""}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Country
          </FieldLabel>
          <Input
            className="rounded-md"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
          />
        </Field>
      </div>

      {isDirty && (
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm">Save Changes</Button>
        </div>
      )}
    </div>
  )
}

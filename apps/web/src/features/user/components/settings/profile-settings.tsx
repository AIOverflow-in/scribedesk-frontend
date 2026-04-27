import * as React from "react"
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
import { mockUser } from "../../data/mock-user"

export function ProfileSettings() {
  const [formData, setFormData] = React.useState(mockUser)

  const isDirty = React.useMemo(() => {
    return (
      formData.firstName !== mockUser.firstName ||
      formData.lastName !== mockUser.lastName ||
      formData.email !== mockUser.email ||
      formData.dob !== mockUser.dob ||
      formData.gender !== mockUser.gender
    )
  }, [formData])

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCancel = () => {
    setFormData(mockUser)
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            First name
          </FieldLabel>
          <Input
            className="rounded-md"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Last name
          </FieldLabel>
          <Input
            className="rounded-md"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel className="text-muted-foreground font-medium text-xs">
          Email address
        </FieldLabel>
        <Input
          type="email"
          className="rounded-md"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Date of birth
          </FieldLabel>
          <Input
            type="date"
            className="rounded-md"
            value={formData.dob}
            onChange={(e) => handleInputChange("dob", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Gender
          </FieldLabel>
          <Select value={formData.gender} onValueChange={(v) => handleInputChange("gender", v)}>
            <SelectTrigger className="rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
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

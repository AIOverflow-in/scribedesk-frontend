"use client";

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
import { useAuth } from "@/contexts/AuthContext"
import { useUpdateProfile } from "../../hooks/use-user"
import { toast } from "@workspace/ui/components/sonner"

export function ProfileSettings() {
  const { user } = useAuth()
  const updateProfileMutation = useUpdateProfile()

  const [formData, setFormData] = React.useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    dob: user?.dob || "",
    gender: (user?.gender as "Male" | "Female" | "Other" | "Prefer not to say") || "Male",
    speciality: user?.speciality || "",
  })

  React.useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        dob: user.dob || "",
        gender: user.gender as "Male" | "Female" | "Other" | "Prefer not to say" || "Male",
        speciality: user.speciality || "",
      })
    }
  }, [user])

  const isDirty = React.useMemo(() => {
    return (
      formData.first_name !== (user?.first_name || "") ||
      formData.last_name !== (user?.last_name || "") ||
      formData.dob !== (user?.dob || "") ||
      formData.gender !== (user?.gender || "Male") ||
      formData.speciality !== (user?.speciality || "")
    )
  }, [formData, user])

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        dob: user.dob || "",
        gender: user.gender as "Male" | "Female" | "Other" | "Prefer not to say" || "Male",
        speciality: user.speciality || "",
      })
    }
  }

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
        dob: formData.dob || undefined,
        gender: formData.gender,
        speciality: formData.speciality || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully")
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to update profile"
          toast.error(message)
        },
      }
    )
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
            placeholder="e.g. John"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Last name
          </FieldLabel>
          <Input
            className="rounded-md"
            placeholder="e.g. Smith"
            value={formData.last_name || ""}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
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
          value={user?.email || ""}
          disabled
        />
        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Date of birth
          </FieldLabel>
          <Input
            type="date"
            className="rounded-md"
            value={formData.dob || ""}
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
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

<Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Speciality
          </FieldLabel>
          <Input
            className="rounded-md"
            placeholder="e.g. General Medicine"
            value={formData.speciality || ""}
            onChange={(e) => handleInputChange("speciality", e.target.value)}
          />
        </Field>

      {isDirty && (
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
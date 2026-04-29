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
import { useUpdateClinic } from "../../hooks/use-clinic"
import { toast } from "@workspace/ui/components/sonner"

const COUNTRY_CODES = ["US", "UK", "IN"]

export function ClinicSettings() {
  const { user } = useAuth()
  const updateClinicMutation = useUpdateClinic()
  const clinic = user?.clinic

  const [formData, setFormData] = React.useState({
    name: clinic?.name || "",
    street: clinic?.street || "",
    city: clinic?.city || "",
    state: clinic?.state || "",
    pincode: clinic?.pincode || "",
    country: clinic?.country || "",
  })

  React.useEffect(() => {
    if (clinic) {
      setFormData({
        name: clinic.name || "",
        street: clinic.street || "",
        city: clinic.city || "",
        state: clinic.state || "",
        pincode: clinic.pincode || "",
        country: clinic.country || "",
      })
    }
  }, [clinic])

  const isDirty = React.useMemo(() => {
    return (
      formData.name !== (clinic?.name || "") ||
      formData.street !== (clinic?.street || "") ||
      formData.city !== (clinic?.city || "") ||
      formData.state !== (clinic?.state || "") ||
      formData.pincode !== (clinic?.pincode || "") ||
      formData.country !== (clinic?.country || "")
    )
  }, [formData, clinic])

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCancel = () => {
    if (clinic) {
      setFormData({
        name: clinic.name || "",
        street: clinic.street || "",
        city: clinic.city || "",
        state: clinic.state || "",
        pincode: clinic.pincode || "",
        country: clinic.country || "",
      })
    }
  }

  const handleSave = () => {
    updateClinicMutation.mutate(
      {
        name: formData.name || undefined,
        street: formData.street || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        country: formData.country || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Clinic updated successfully")
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to update clinic"
          toast.error(message)
        },
      }
    )
  }

  const isValidCountryCode = (code: string) => COUNTRY_CODES.includes(code)

  return (
    <div className="flex flex-col gap-5 w-full max-w-md">
      <div className="flex items-center gap-4">
        {clinic?.logo_url ? (
          <img
            src={clinic.logo_url}
            alt={formData.name || "Clinic"}
            className="h-16 w-16 rounded-full object-cover border border-muted"
          />
        ) : (
          <img
            src="/icons/clinic/clinic.png"
            alt="Clinic"
            className="h-16 w-16 rounded-full object-cover border border-muted"
          />
        )}
        <div className="flex-1">
          <FieldLabel className="text-muted-foreground font-medium text-xs mb-1.5 block">
            Clinic name
          </FieldLabel>
          <Input
            className="rounded-md"
            placeholder="e.g. Mitchell Family Medicine"
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
          placeholder="e.g. 742 Evergreen Terrace"
          value={formData.street || ""}
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
            placeholder="e.g. Springfield"
            value={formData.city || ""}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            State
          </FieldLabel>
          <Input
            className="rounded-md"
            placeholder="e.g. Oregon"
            value={formData.state || ""}
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
            placeholder="e.g. 97477"
            value={formData.pincode || ""}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel className="text-muted-foreground font-medium text-xs">
            Country
          </FieldLabel>
          <Select
            value={isValidCountryCode(formData.country) ? formData.country : ""}
            onValueChange={(v) => handleInputChange("country", v)}
            disabled
          >
            <SelectTrigger className="rounded-md">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="IN">India</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      {isDirty && (
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={updateClinicMutation.isPending}>
            {updateClinicMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
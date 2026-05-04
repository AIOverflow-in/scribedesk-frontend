"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { cn } from "@workspace/ui/lib/utils"
import { Check } from "lucide-react"
import { useAuthOnboarding } from "../hooks/use-auth-flow"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@workspace/ui/components/sonner"
import { StepPersonal } from "./steps/step-personal"
import { StepClinic } from "./steps/step-clinic"
import type { PersonalDetails, ClinicDetails } from "../types"

const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  speciality: z.string().optional(),
})

const clinicSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
})

export function OnboardingForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [personal, setPersonal] = useState<PersonalDetails>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "male",
    speciality: "",
  })
  const [clinic, setClinic] = useState<ClinicDetails>({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorTimeout, setErrorTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)

  const onboardingMutation = useAuthOnboarding()

  useEffect(() => {
    if (user) {
      const nameParts = (user.first_name || "").split(" ")
      setPersonal((prev) => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
      }))
    }
  }, [user])

  const clearErrorsAfterDelay = () => {
    if (errorTimeout) clearTimeout(errorTimeout)
    const timeout = setTimeout(() => setErrors({}), 5000)
    setErrorTimeout(timeout)
  }

  const handlePersonalNext = () => {
    setErrors({})
    const result = personalSchema.safeParse(personal)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const mapped: Record<string, string> = {}
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value) mapped[key] = value[0]
      })
      setErrors(mapped)
      clearErrorsAfterDelay()
      return
    }
    setStep(2)
  }

  const submitForm = () => {
    setErrors({})
    const clinicResult = clinicSchema.safeParse(clinic)
    if (!clinicResult.success) {
      const fieldErrors = clinicResult.error.flatten().fieldErrors
      const mapped: Record<string, string> = {}
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value) mapped[`clinic.${key}`] = value[0]
      })
      setErrors(mapped)
      clearErrorsAfterDelay()
      return
    }

    onboardingMutation.mutate(
      {
        profile: {
          first_name: personal.firstName,
          last_name: personal.lastName || undefined,
          gender: personal.gender === "male" ? "Male" : personal.gender === "female" ? "Female" : "Other",
          speciality: personal.speciality || undefined,
        },
        clinic: {
          name: clinic.name,
          street: clinic.street || undefined,
          city: clinic.city || undefined,
          state: clinic.state || undefined,
          pincode: clinic.pincode || undefined,
          country: clinic.country,
        },
      },
      {
        onSuccess: () => {
          toast.success("Profile completed successfully")
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to complete profile"
          toast.error(message)
        },
      }
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-1 text-center mb-2">
        <h1 className="text-2xl font-bold">Complete your profile</h1>
        <p className="text-sm text-muted-foreground">
          You're almost there! Just fill in your details to get started.
        </p>
      </div>

      <div className="flex items-center justify-center gap-0">
        <StepIndicator step={1} currentStep={step} label="Personal" />
        <div className="h-px bg-border w-8 mx-2" />
        <StepIndicator step={2} currentStep={step} label="Clinic" />
      </div>

      {step === 1 && (
        <StepPersonal
          data={personal}
          onChange={setPersonal}
          onNext={handlePersonalNext}
          errors={errors}
          hidePassword
          disableEmail
        />
      )}

      {step === 2 && (
        <StepClinic
          data={clinic}
          onChange={setClinic}
          onBack={() => setStep(1)}
          onSubmit={submitForm}
          isPending={onboardingMutation.isPending}
          errors={errors}
        />
      )}
    </form>
  )
}

function StepIndicator({
  step,
  currentStep,
  label,
}: {
  step: number
  currentStep: number
  label: string
}) {
  const isActive = step === currentStep
  const isCompleted = step < currentStep

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium",
          isActive && "bg-primary text-primary-foreground",
          isCompleted && "bg-green-600 text-white",
          !isActive && !isCompleted && "bg-muted text-muted-foreground"
        )}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : step}
      </div>
      <span
        className={cn(
          "text-sm",
          isActive && "font-medium",
          !isActive && "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  )
}

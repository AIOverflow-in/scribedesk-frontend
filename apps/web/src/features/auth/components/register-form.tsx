"use client";

import { useState } from "react";
import { z } from "zod";
import { cn } from "@workspace/ui/lib/utils"
import { Check } from "lucide-react"
import { StepPersonal } from "./steps/step-personal"
import { StepClinic } from "./steps/step-clinic"
import { useAuthRegister } from "../hooks/use-auth-flow"
import { toast } from "@workspace/ui/components/sonner"
import type { PersonalDetails, ClinicDetails } from "../types"

export const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dob: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  speciality: z.string().optional(),
})

export const clinicSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
})

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [step, setStep] = useState(1)
  const [personal, setPersonal] = useState<PersonalDetails>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
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

  const registerMutation = useAuthRegister()

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

    registerMutation.mutate(
      {
        email: personal.email,
        password: personal.password,
        profile: {
          first_name: personal.firstName,
          last_name: personal.lastName || undefined,
          dob: personal.dob || undefined,
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
          toast.success("Account created successfully")
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to create account"
          toast.error(message)
        },
      }
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0">
        <StepIndicator step={1} currentStep={step} label="Personal" />
        <div className="h-px bg-border w-8 mx-2" />
        <StepIndicator step={2} currentStep={step} label="Clinic" />
      </div>

      {/* Step Content */}
      {step === 1 && (
        <StepPersonal
          data={personal}
          onChange={setPersonal}
          onNext={handlePersonalNext}
          errors={errors}
        />
      )}

      {step === 2 && (
        <StepClinic
          data={clinic}
          onChange={setClinic}
          onBack={() => setStep(1)}
          onSubmit={submitForm}
          isPending={registerMutation.isPending}
          errors={errors}
        />
      )}

      {step === 1 && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4">
            Login
          </a>
        </p>
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
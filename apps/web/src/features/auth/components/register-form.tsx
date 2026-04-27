import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Check } from "lucide-react"
import { StepPersonal } from "./steps/step-personal"
import { StepClinic } from "./steps/step-clinic"
import type { PersonalDetails, ClinicDetails } from "../types"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ personal, clinic })
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
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
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepClinic
          data={clinic}
          onChange={setClinic}
          onBack={() => setStep(1)}
          onSubmit={() => handleSubmit}
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

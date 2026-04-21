import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import type { Patient } from "@workspace/features/scribe/types"

export interface PatientInfoCardProps {
  patient: Patient
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
}

const avatarSizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
}

export function PatientInfoCard({ patient, size = "md" }: PatientInfoCardProps) {
  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-2">
      <Avatar className={avatarSizes[size]}>
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className={`font-medium text-foreground ${sizeClasses[size]}`}>
          {patient.name}
        </span>
        <span className="text-muted-foreground text-xs">
          {patient.age}y • {patient.gender}
        </span>
      </div>
    </div>
  )
}

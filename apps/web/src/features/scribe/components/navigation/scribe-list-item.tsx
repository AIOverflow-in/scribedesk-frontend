import { cn } from "@workspace/ui/lib/utils"
import { capitalize, formatDuration } from "@/shared/lib/utils"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ScribeListItemProps {
  consultation: Consultation
  isSelected?: boolean
  onClick: () => void
}

const genderStyles: Record<string, string> = {
  male: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  female: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  other: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

export function ScribeListItem({
  consultation,
  isSelected = false,
  onClick,
}: ScribeListItemProps) {
  const gender = consultation.patient.gender?.toLowerCase() ?? "other"
  const hasPatient = consultation.patient.name && consultation.patient.name !== "Unknown Patient"

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left py-3 px-3 transition-colors hover:bg-accent/50 border-b border-border relative overflow-hidden cursor-pointer",
        isSelected && "bg-accent"
      )}
    >
      <div>
        {/* Title */}
        <p className="text-base font-medium truncate pr-16">{consultation.title}</p>

        {/* Duration tag - top right */}
        {consultation.duration && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[11px] font-medium text-foreground/50 bg-muted px-1.5 py-0.5 rounded">
              {formatDuration(consultation.duration)}
            </span>
          </div>
        )}

        {/* Patient: Name · Gender · Age */}
        {hasPatient ? (
          <p className="text-[13px] font-medium text-foreground/60 mt-0.5">
            {consultation.patient.name}
            <span className="text-foreground/30 mx-1">·</span>
            <span className={cn("text-[11px] font-medium px-1.5 rounded", genderStyles[gender] ?? genderStyles.other)}>
              {capitalize(consultation.patient.gender)}
            </span>
            <span className="text-foreground/30 mx-1">·</span>
            <span className="text-[12px] text-foreground/50">{consultation.patient.age}y</span>
          </p>
        ) : (
          <p className="text-[13px] text-foreground/40 mt-0.5 italic">No patient assigned</p>
        )}

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
          {consultation.description}
        </p>
      </div>
    </button>
  )
}

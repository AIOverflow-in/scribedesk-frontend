import { cn } from "@workspace/ui/lib/utils"
import { ConsultationStatusBadge } from "@workspace/features/scribe/components/shared/consultation-status"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ScribeListItemProps {
  consultation: Consultation
  isSelected?: boolean
  onClick: () => void
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const formatDuration = (minutes?: number) => {
  if (!minutes) return null
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function ScribeListItem({
  consultation,
  isSelected = false,
  onClick,
}: ScribeListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left py-3 px-3 transition-colors hover:bg-accent/50 border-b border-border relative overflow-hidden cursor-pointer",
        isSelected && "bg-accent"
      )}
    >
      {/* Status Badge - positioned absolutely on top */}
      <div className="absolute top-3 right-3 z-10 bg-inherit">
        <ConsultationStatusBadge status={consultation.status} />
      </div>

      {/* Content - extends full width */}
      <div>
        {/* Title */}
        <p className="text-base font-medium truncate pr-16">{consultation.title}</p>

        {/* Patient Details: name, date, duration */}
        <p className="text-[13px] font-medium text-foreground/80 pr-16 mt-0.5">
          {consultation.patient.name} <span className="text-[11px] text-foreground/60 ml-2">{formatDate(consultation.date)}</span>
          {consultation.duration && (
            <>
              <span className="mx-1 text-[11px] text-foreground/60">•</span>
              <span className="text-[11px] text-foreground/60">{formatDuration(consultation.duration)}</span>
            </>
          )}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-3 mt-2">
          {consultation.description}
        </p>
      </div>
    </button>
  )
}

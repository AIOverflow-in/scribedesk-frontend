import { cn } from "@workspace/ui/lib/utils"
import { capitalize, formatDuration } from "@/shared/utils"
import { useScribeStore } from "../../stores/scribe-store"
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
  const isRecording = useScribeStore((s) => s.isRecording)
  const recordingSessionId = useScribeStore((s) => s.recordingSessionId)
  const isLive = isRecording && recordingSessionId === consultation.id

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left py-3 px-3 transition-colors hover:bg-accent/50 border-b border-border relative overflow-hidden cursor-pointer",
        isSelected && "bg-accent"
      )}
    >
      <style>{`
@keyframes live-ping {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2.5); opacity: 0; }
}
.animate-live-ping {
  animation: live-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
`}</style>
      <div>
        {/* Title + Live badge */}
        <div className="flex items-center gap-2 pr-16">
          <p className="text-base font-medium truncate leading-none">{consultation.title}</p>
          {isLive && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-white bg-red-600 px-1.5 py-1 rounded uppercase tracking-wide leading-none shrink-0 shadow-sm">
              <span className="relative flex items-center justify-center w-2 h-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-white animate-live-ping absolute" />
                <span className="block w-1 h-1 rounded-full bg-white relative" />
              </span>
              Live
            </span>
          )}
        </div>

        {/* Duration tag - top right */}
        {consultation.duration && (
          <div className="absolute top-3 right-3">
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
            <span className={cn("text-[11px] font-medium px-1.5 py-0.5 rounded-md", genderStyles[gender] ?? genderStyles.other)}>
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

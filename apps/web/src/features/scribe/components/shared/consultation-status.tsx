import { Badge } from "@workspace/ui/components/badge"
import type { ConsultationStatus } from "@workspace/features/scribe/types"

export interface ConsultationStatusProps {
  status: ConsultationStatus
}

const statusConfig: Record<
  ConsultationStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  "in-progress": { label: "In Progress", variant: "default" },
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  archived: { label: "Archived", variant: "secondary" },
}

export function ConsultationStatusBadge({ status }: ConsultationStatusProps) {
  const config = statusConfig[status]

  return (
    <Badge 
      variant={config.variant} 
      className="text-[9px] uppercase font-semibold tracking-wider h-4 px-1.5 leading-none"
    >
      {config.label}
    </Badge>
  )
}

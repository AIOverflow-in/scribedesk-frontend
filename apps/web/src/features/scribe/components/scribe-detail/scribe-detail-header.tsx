import { PanelLeft, ArrowLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb"
import { PatientInfoCard } from "@workspace/features/scribe/components/shared/patient-info-card"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ScribeDetailHeaderProps {
  consultation: Consultation
  isListVisible: boolean
  onToggleList: () => void
  isMobile?: boolean
}

export function ScribeDetailHeader({
  consultation,
  isListVisible,
  onToggleList,
  isMobile = false,
}: ScribeDetailHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Breadcrumb with Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 cursor-pointer"
          onClick={onToggleList}
        >
          {isMobile ? (
            <ArrowLeft className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
          <span className="sr-only">{isMobile ? "Back to list" : "Toggle list"}</span>
        </Button>

        <div className="h-3.5 w-px shrink-0 bg-border" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/scribe">Sessions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {consultation.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Consultation Title & Patient Info */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{consultation.title}</h2>
          <PatientInfoCard patient={consultation.patient} size="md" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Resume
          </Button>
          <Button size="sm">
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}

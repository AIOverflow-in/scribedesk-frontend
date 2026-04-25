import { useState } from "react"
import { PanelLeft, ArrowLeft, Pencil, CirclePlus, ChevronDown, AudioLines, ScreenShare } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import type { Consultation } from "@workspace/features/scribe/types"
import { useScribe } from "../../context/scribe-context"

export interface ScribeDetailHeaderProps {
  consultation: Consultation
  isListVisible: boolean
  onToggleList: () => void
  isMobile?: boolean
}

type ResumeOption = "transcribe" | "telehealth"

export function ScribeDetailHeader({
  consultation,
  isListVisible,
  onToggleList,
  isMobile = false,
}: ScribeDetailHeaderProps) {
  const [activeOption, setActiveOption] = useState<ResumeOption>("transcribe")
  const { openDocModal } = useScribe()

  const options = {
    transcribe: {
      label: "Transcribe",
      icon: <AudioLines className="h-4 w-4 text-red-500" />,
    },
    telehealth: {
      label: "Telehealth",
      icon: <ScreenShare className="h-4 w-4 text-blue-500" />,
    },
  }

  return (
    <div className="space-y-3">
      {/* Breadcrumb with Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 cursor-pointer rounded-md"
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Patient Avatar */}
          <Avatar className="shrink-0 h-12! w-12!">
            <AvatarFallback className="bg-primary/10 text-primary text-lg! font-medium">
              {consultation.patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          {/* Title and Patient Details */}
          <div className="flex-1 min-w-0">
            <div className="group flex items-center gap-2 cursor-pointer w-fit">
              <h2 className="text-xl font-medium">{consultation.title}</h2>
              <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="font-medium text-foreground/90">
                {consultation.patient.name}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{consultation.patient.age} yrs, {consultation.patient.gender.charAt(0).toUpperCase() + consultation.patient.gender.slice(1)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button className="rounded-md cursor-pointer gap-2" onClick={openDocModal}>
            <CirclePlus className="h-4 w-4" />
            Create
          </Button>
          
          <ButtonGroup>
            <Button variant="outline" className="rounded-md cursor-pointer gap-2">
              {options[activeOption].icon}
              Resume
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-8 px-0 rounded-md cursor-pointer">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Resume options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => setActiveOption("transcribe")}
                >
                  <AudioLines className="h-4 w-4 text-red-500" />
                  <span>Transcribe</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2 cursor-pointer"
                  onClick={() => setActiveOption("telehealth")}
                >
                  <ScreenShare className="h-4 w-4 text-blue-500" />
                  <span>Telehealth</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )
}

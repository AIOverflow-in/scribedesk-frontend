import { useState } from "react"
import { PanelLeft, ArrowLeft, Pencil, Trash2, CirclePlus, ChevronDown, AudioLines, ScreenShare, Square, Pause, User } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import type { Consultation } from "@workspace/features/scribe/types"
import { useScribe } from "../../context/scribe-context"
import { useScribeWs } from "../../hooks/use-scribe-ws"
import { useScribeStore } from "../../stores/scribe-store"
import { usePauseScribeSession } from "../../hooks/use-scribe-sessions"

export interface ScribeDetailHeaderProps {
  consultation: Consultation
  isListVisible: boolean
  onToggleList: () => void
  onDelete: (sessionId: string) => void
  isMobile?: boolean
}

type ResumeOption = "transcribe" | "telehealth"

export function ScribeDetailHeader({
  consultation,
  onToggleList,
  onDelete,
  isMobile = false,
}: ScribeDetailHeaderProps) {
  const [activeOption, setActiveOption] = useState<ResumeOption>("transcribe")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { openDocModal, openEditModal } = useScribe()
  const isRecording = useScribeStore((s: any) => s.isRecording)
  const isSaving = useScribeStore((s: any) => s.isSaving)
  const setSaving = useScribeStore((s: any) => s.setSaving)
  const setAudioSource = useScribeStore((s: any) => s.setAudioSource)
  const { connect, disconnect } = useScribeWs(consultation.id)
  const pauseMutation = usePauseScribeSession()

  const handleStop = (generateSummary: boolean) => {
    disconnect()
    useScribeStore.setState({ pendingChunks: "", currentPartial: "" })
    setSaving(true)
    pauseMutation.mutate(
      { sessionId: consultation.id, data: { generate_summary: generateSummary } },
      {
        onSettled: () => setSaving(false),
      }
    )
  }

  const handleResumeClick = () => {
    if (isRecording) {
      handleStop(true)
    } else {
      connect()
    }
  }

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
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-pointer rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
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
                <BreadcrumbPage className="text-muted-foreground">Sessions</BreadcrumbPage>
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

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="shrink-0 h-12! w-12!">
              <AvatarFallback className="bg-primary/10 text-primary dark:text-blue-400 text-lg! font-medium">
                {consultation.patient.name && consultation.patient.name !== "Unknown Patient"
                  ? consultation.patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : <User className="h-6 w-6 dark:text-blue-400" />}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div
                className="group flex items-center gap-2 cursor-pointer w-fit"
                onClick={openEditModal}
              >
                <h2 className="text-xl font-medium">{consultation.title}</h2>
                <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <Trash2
                  className="h-3.5 w-3.5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive/80"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteOpen(true)
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm">
                {consultation.patient.name && consultation.patient.name !== "Unknown Patient" ? (
                  <>
                    <span className="font-medium text-foreground/90">
                      {consultation.patient.name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{consultation.patient.age} yrs, {consultation.patient.gender.charAt(0).toUpperCase() + consultation.patient.gender.slice(1)}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground italic">Patient not assigned</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isRecording && !isSaving ? (
              <Button
                variant="outline"
                className="rounded-md cursor-pointer gap-2"
                onClick={() => handleStop(false)}
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            ) : !isSaving && (
              <Button
                className="rounded-md cursor-pointer gap-2"
                onClick={openDocModal}
                disabled={!consultation.duration}
              >
                <CirclePlus className="h-4 w-4" />
                Create
              </Button>
            )}

            <ButtonGroup>
              <Button
                variant={isRecording || isSaving ? "default" : "outline"}
                className={`rounded-md cursor-pointer gap-2 ${isRecording || isSaving ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                onClick={handleResumeClick}
                disabled={isSaving}
              >
                {isSaving ? null : isRecording ? <Square className="h-4 w-4" /> : options[activeOption].icon}
                {isSaving ? "Saving..." : isRecording ? "Stop" : consultation.duration ? "Resume" : options[activeOption].label}
              </Button>
              {!isRecording && !isSaving && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="w-8 px-0 rounded-md cursor-pointer">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() => {
                        setActiveOption("transcribe")
                        setAudioSource("mic")
                      }}
                    >
                      <AudioLines className="h-4 w-4 text-red-500" />
                      <span>Transcribe</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() => {
                        setActiveOption("telehealth")
                        setAudioSource("webrtc")
                      }}
                    >
                      <ScreenShare className="h-4 w-4 text-blue-500" />
                      <span>Telehealth</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </ButtonGroup>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{consultation.title}" and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => onDelete(consultation.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

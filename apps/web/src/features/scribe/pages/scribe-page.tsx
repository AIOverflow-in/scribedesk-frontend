import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ScribeList } from "@workspace/features/scribe/components/navigation/scribe-list"
import { ScribeDetail } from "@workspace/features/scribe/components/workspace/scribe-detail"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ScribeEmptyState } from "@workspace/features/scribe/components/navigation/scribe-empty-state"
import { DocumentTypeModal } from "@workspace/features/scribe/components/documentation/document-modal/document-type-modal"
import { EditSessionModal } from "@workspace/features/scribe/components/workspace/modals/edit-session-modal"
import { DraftingSheet } from "@workspace/features/scribe/components/documentation/drafting-sheet"
import { ScribeSidecar } from "@workspace/features/scribe/components/sidecar/sidecar-root"
import { AssistantLauncher } from "@workspace/features/scribe/components/sidecar/assistant-launcher"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import { cn } from "@workspace/ui/lib/utils"
import { ScribeProvider, useScribe } from "../context/scribe-context"
import { useScribeSessions, useCreateScribeSession, useScribeSession, useDeleteScribeSession } from "../hooks/use-scribe-sessions"
import { usePatients } from "@workspace/hooks/patient"
import { apiClient } from "@/lib/api-client"
import type { Consultation } from "../types"
import { mapSessionToConsultation } from "../types"
import type { SessionResponse, SessionListItem } from "@workspace/schemas/session"
import type { PaginatedPatientsResponse } from "@workspace/schemas/patient"

function ScribeContent() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as any
  const selectedId = search.id
  const { setConsultation, isSidecarOpen } = useScribe()
  const [page] = useState(1)

  const [isListVisible, setIsListVisible] = useState(true)
  const isMobile = useIsMobile()

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sortBy, setSortBy] = useState<"created_at" | "title" | "patient_name">("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterPatientId, setFilterPatientId] = useState<string | null>(null)

  const { data: patientsData } = usePatients(apiClient, { pageSize: 200 })
  const patients = (patientsData as PaginatedPatientsResponse | undefined)?.items ?? []

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const handleSortChange = useCallback((column: "created_at" | "title" | "patient_name", order: "asc" | "desc") => {
    setSortBy(column)
    setSortOrder(order)
  }, [])

  const { data: sessionsData, isPending: isListPending } = useScribeSessions({
    page,
    pageSize: 50,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
    patientId: filterPatientId ?? undefined,
  })
  const { data: sessionData, isLoading: isDetailLoading } = useScribeSession(selectedId ?? "")

  const consultations = useMemo<Consultation[]>(() => {
    if (!sessionsData?.items) return []
    return (sessionsData.items as SessionListItem[]).map(mapSessionToConsultation)
  }, [sessionsData])

  const selectedConsultation = useMemo<Consultation | null>(() => {
    if (!sessionData) {
      return selectedId ? consultations.find((c) => c.id === selectedId) ?? null : null
    }
    return mapSessionToConsultation(sessionData as SessionResponse)
  }, [sessionData, selectedId, consultations])

  const createSession = useCreateScribeSession()
  const deleteSession = useDeleteScribeSession()

  useEffect(() => {
    if (search.newSession === "true") {
      createSession.mutate({})
    }
  }, [search.newSession])

  useEffect(() => {
    setConsultation(selectedConsultation || null)
  }, [selectedConsultation, setConsultation])

  const handleSelectConsultation = (id: string) => {
    if (id === selectedId) return
    navigate({ to: "/scribe", search: { id } as any })
  }

  const handleToggleList = () => {
    if (isMobile) {
      navigate({ to: "/scribe", search: { id: undefined } as any })
    } else {
      setIsListVisible(!isListVisible)
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession.mutate(sessionId)
  }

  const showList = isListVisible && (!isMobile || !selectedId)
  const showDetail = !isMobile || selectedId

  return (
    <>
      <div className="flex h-[calc(100vh-2.75rem)] overflow-hidden -m-6 bg-muted/40">
        {/* 1. Left Navigation Panel */}
        <div
          className={cn(
            "shrink-0 border-r border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
            showList ? "w-full md:w-80 opacity-100" : "w-0 opacity-0 border-none"
          )}
        >
          <div className="w-full md:w-80 h-full flex flex-col pl-1.5">
            <ScribeList
              consultations={consultations}
              selectedId={selectedId}
              onSelectConsultation={handleSelectConsultation}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              isPending={isListPending}
              filterPatientId={filterPatientId}
              onPatientFilterChange={setFilterPatientId}
              patients={patients}
            />
          </div>
        </div>

        {/* 2. Main Clinical Workspace & Sidecar */}
        <div
          className={cn(
            "flex-1 min-w-0 transition-all duration-300 ease-in-out flex bg-background/50 relative",
            showDetail ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
          )}
        >
          {isDetailLoading ? (
            <div className="flex flex-col h-full w-full px-4 pt-2 pb-4 gap-6 animate-pulse">
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          ) : selectedConsultation ? (
            <div className="flex flex-1 w-full h-full overflow-hidden">
              {/* Workspace Panel */}
              <div className={cn(
                "h-full transition-all duration-500 ease-in-out min-w-0",
                isSidecarOpen && !isMobile ? "w-1/2 border-r" : "w-full"
              )}>
                <ScribeDetail
                  consultation={selectedConsultation}
                  isListVisible={isListVisible}
                  onToggleList={handleToggleList}
                  onDelete={handleDeleteSession}
                  isMobile={isMobile}
                />
              </div>

              {/* Assistant Sidecar Panel */}
              {!isMobile && (
                <div className={cn(
                  "h-full transition-[width,opacity] duration-500 ease-in-out overflow-hidden",
                  isSidecarOpen ? "w-1/2 opacity-100" : "w-0 opacity-0 pointer-events-none"
                )}>
                  <ScribeSidecar />
                </div>
              )}
            </div>
          ) : (
            <ScribeEmptyState />
          )}
        </div>
      </div>

      <DocumentTypeModal />
      <EditSessionModal />
      <DraftingSheet />
      {selectedConsultation && <AssistantLauncher />}
    </>
  )
}

export function ScribePage() {
  return (
    <ScribeProvider>
      <ScribeContent />
    </ScribeProvider>
  )
}

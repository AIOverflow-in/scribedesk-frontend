import { useState, useEffect } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { DashboardLayout } from "@/shared/layout/dashboard-layout"
import { ScribeList } from "@workspace/features/scribe/components/navigation/scribe-list"
import { ScribeListSkeleton } from "@workspace/features/scribe/components/navigation/scribe-list-skeleton"
import { ScribeDetail } from "@workspace/features/scribe/components/workspace/scribe-detail"
import { ScribeDetailSkeleton } from "@workspace/features/scribe/components/workspace/scribe-detail-skeleton"
import { ScribeEmptyState } from "@workspace/features/scribe/components/navigation/scribe-empty-state"
import { DocumentTypeModal } from "@workspace/features/scribe/components/documentation/document-modal/document-type-modal"
import { EditSessionModal } from "@workspace/features/scribe/components/workspace/modals/edit-session-modal"
import { DraftingSheet } from "@workspace/features/scribe/components/documentation/drafting-sheet"
import { ScribeSidecar } from "@workspace/features/scribe/components/sidecar/sidecar-root"
import { AssistantLauncher } from "@workspace/features/scribe/components/sidecar/assistant-launcher"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import { cn } from "@workspace/ui/lib/utils"
import { mockConsultations } from "../data/mock-consultations"
import { ScribeProvider, useScribe } from "../context/scribe-context"

function ScribeContent() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as any
  const selectedId = search.id
  const { setConsultation, isSidecarOpen } = useScribe()
  
  const [isListVisible, setIsListVisible] = useState(true)
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isFetchingDetail, setIsFetchingDetail] = useState(!!selectedId)
  const isMobile = useIsMobile()

  const selectedConsultation = mockConsultations.find((c) => c.id === selectedId)

  useEffect(() => {
    const listTimer = setTimeout(() => setIsLoadingList(false), 1000)
    let detailTimer: NodeJS.Timeout
    if (selectedId) {
      setIsFetchingDetail(true)
      detailTimer = setTimeout(() => setIsFetchingDetail(false), 800)
    }
    return () => {
      clearTimeout(listTimer)
      if (detailTimer) clearTimeout(detailTimer)
    }
  }, [selectedId])

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

  const showList = isListVisible && (!isMobile || !selectedId)
  const showDetail = !isMobile || selectedId

  return (
    <>
      <DashboardLayout>
        <div className="flex h-[calc(100vh-2.75rem)] overflow-hidden -m-6 bg-muted/40">
          {/* 1. Left Navigation Panel */}
          <div 
            className={cn(
              "shrink-0 border-r border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
              showList ? "w-full md:w-80 opacity-100" : "w-0 opacity-0 border-none"
            )}
          >
            <div className="w-full md:w-80 h-full flex flex-col">
              {isLoadingList ? (
                <ScribeListSkeleton />
              ) : (
                <ScribeList
                  consultations={mockConsultations}
                  selectedId={selectedId}
                  onSelectConsultation={handleSelectConsultation}
                />
              )}
            </div>
          </div>

          {/* 2. Main Clinical Workspace & Sidecar */}
          <div 
            className={cn(
              "flex-1 min-w-0 transition-all duration-300 ease-in-out flex bg-background/50 relative",
              showDetail ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
            )}
          >
            {isFetchingDetail ? (
              <ScribeDetailSkeleton />
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
      </DashboardLayout>
      
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

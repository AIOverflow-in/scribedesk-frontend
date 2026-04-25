import { useState } from "react"
import { DashboardLayout } from "@/shared/layout/dashboard-layout"
import { ScribeList } from "@workspace/features/scribe/components/scribe-list/scribe-list"
import { ScribeDetail } from "@workspace/features/scribe/components/scribe-detail/scribe-detail"
import { ScribeEmptyState } from "@workspace/features/scribe/components/scribe-list/scribe-empty-state"
import { DocumentTypeModal } from "@workspace/features/scribe/components/scribe-detail/document-type-modal"
import { DraftingSheet } from "@workspace/features/scribe/components/scribe-detail/drafting-sheet"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import { cn } from "@workspace/ui/lib/utils"
import { mockConsultations } from "../data/mock-consultations"
import { ScribeProvider } from "../context/scribe-context"

export function ScribePage() {
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [isListVisible, setIsListVisible] = useState(true)
  const isMobile = useIsMobile()

  const selectedConsultation = mockConsultations.find((c) => c.id === selectedId)

  const handleToggleList = () => {
    if (isMobile) {
      setSelectedId(undefined)
    } else {
      setIsListVisible(!isListVisible)
    }
  }

  const showList = isListVisible && (!isMobile || !selectedId)
  const showDetail = !isMobile || selectedId

  return (
    <ScribeProvider>
      <DashboardLayout>
        <div className="flex h-[calc(100vh-2.75rem)] overflow-hidden -m-6 bg-muted/40">
          {/* List Panel */}
          <div 
            className={cn(
              "shrink-0 border-r border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
              showList ? "w-full md:w-80 opacity-100" : "w-0 opacity-0 border-none"
            )}
          >
            <div className="w-full md:w-80 h-full flex flex-col">
              <ScribeList
                consultations={mockConsultations}
                selectedId={selectedId}
                onSelectConsultation={setSelectedId}
              />
            </div>
          </div>

          {/* Detail Panel */}
          <div 
            className={cn(
              "flex-1 min-w-0 transition-all duration-300 ease-in-out",
              showDetail ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
            )}
          >
            {selectedConsultation ? (
              <ScribeDetail
                consultation={selectedConsultation}
                isListVisible={isListVisible}
                onToggleList={handleToggleList}
                isMobile={isMobile}
              />
            ) : (
              <ScribeEmptyState />
            )}
          </div>
        </div>
      </DashboardLayout>
      <DocumentTypeModal />
      <DraftingSheet />
    </ScribeProvider>
  )
}

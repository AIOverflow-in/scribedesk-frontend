import { useState } from "react"
import { DashboardLayout } from "@/shared/layout/dashboard-layout"
import { ScribeList } from "@workspace/features/scribe/components/scribe-list/scribe-list"
import { ScribeDetail } from "@workspace/features/scribe/components/scribe-detail/scribe-detail"
import { ScribeEmptyState } from "@workspace/features/scribe/components/scribe-list/scribe-empty-state"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import { cn } from "@workspace/ui/lib/utils"
import type { Consultation } from "@workspace/features/scribe/types"

// Mock data - replace with actual data fetching
const mockConsultations: Consultation[] = [
  {
    id: "1",
    title: "Annual Checkup",
    patient: {
      id: "p1",
      name: "John Doe",
      age: 45,
      gender: "male",
    },
    date: "2024-01-15",
    description: "Routine annual health checkup including physical examination, blood pressure monitoring, cholesterol screening, and discussion about lifestyle modifications. Patient reported mild fatigue but overall feeling well.",
    duration: 45,
    status: "completed",
    transcript: "Doctor: Good morning, John. How are you feeling today?\nPatient: I've been feeling generally well, just some occasional fatigue.\nDoctor: I see. Let's check your vitals and go through your regular checkup.\n...",
    summary: "Patient presented for annual checkup. Overall health is good with mild fatigue reported. Vitals within normal range. Recommended follow-up in 6 months.",
    reports: [
      {
        id: "r1",
        title: "Lab Results",
        type: "Medical Report",
        createdAt: "2024-01-15",
      },
      {
        id: "r2",
        title: "Prescription Summary",
        type: "Prescription",
        createdAt: "2024-01-15",
      },
    ],
  },
  {
    id: "2",
    title: "Follow-up Consultation",
    patient: {
      id: "p2",
      name: "Jane Smith",
      age: 32,
      gender: "female",
    },
    date: "2024-01-18",
    description: "Post-treatment follow-up to review recovery progress, discuss any ongoing symptoms, and adjust treatment plan if necessary. Patient responded well to initial treatment.",
    duration: 30,
    status: "in-progress",
    transcript: "",
    summary: "",
    reports: [],
  },
]

export function ScribePage() {
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [isListVisible, setIsListVisible] = useState(true)
  const isMobile = useIsMobile()

  const selectedConsultation = mockConsultations.find((c) => c.id === selectedId)

  const handleToggleList = () => {
    if (isMobile) {
      // On mobile, the "back" button clears the selection
      setSelectedId(undefined)
    } else {
      setIsListVisible(!isListVisible)
    }
  }

  // Animation states
  const showList = isListVisible && (!isMobile || !selectedId)
  const showDetail = !isMobile || selectedId

  return (
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
  )
}

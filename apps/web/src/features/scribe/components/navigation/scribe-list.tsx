import { useMemo } from "react"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import { ScribeListHeader } from "./scribe-list-header"
import { ScribeListItem } from "./scribe-list-item"
import { ScribeListSkeleton } from "./scribe-list-skeleton"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription
} from "@workspace/ui/components/empty"
import { Stethoscope } from "lucide-react"
import type { Consultation } from "@workspace/features/scribe/types"
import { getDateKey } from "@/shared/lib/utils"
import { useScribeStore } from "../../stores/scribe-store"

export interface ScribeListProps {
  consultations: Consultation[]
  selectedId?: string
  onSelectConsultation: (id: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: "created_at" | "title" | "patient_name"
  sortOrder: "asc" | "desc"
  onSortChange: (column: "created_at" | "title" | "patient_name", order: "asc" | "desc") => void
  isPending?: boolean
  filterPatientId: string | null
  onPatientFilterChange: (patientId: string | null) => void
  patients: any[]
}

const formatDateHeader = (dateKey: string) => {
  const todayKey = getDateKey(new Date().toISOString())
  if (dateKey === todayKey) return "Today"

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateKey === getDateKey(yesterday.toISOString())) return "Yesterday"

  const [y, m, d] = dateKey.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function ScribeList({
  consultations,
  selectedId,
  onSelectConsultation,
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  isPending,
  filterPatientId,
  onPatientFilterChange,
  patients,
}: ScribeListProps) {
  const isDateGrouped = sortBy === "created_at"
  const isRecording = useScribeStore((s) => s.isRecording)
  const recordingSessionId = useScribeStore((s) => s.recordingSessionId)

  const handleSelect = (id: string) => {
    if (isRecording && id !== recordingSessionId) return
    onSelectConsultation(id)
  }

  const grouped = useMemo(() => {
    if (isDateGrouped) {
      const groups: Record<string, Consultation[]> = {}
      for (const c of consultations) {
        const key = getDateKey(c.date)
        if (!groups[key]) groups[key] = []
        groups[key].push(c)
      }
      return Object.entries(groups).sort(([a], [b]) =>
        sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)
      )
    }
    return null
  }, [consultations, isDateGrouped, sortOrder])

  return (
    <div className="flex flex-col h-full">
      <ScribeListHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        filterPatientId={filterPatientId}
        onPatientFilterChange={onPatientFilterChange}
        patients={patients}
      />

      <NativeScroll className="flex-1">
        {isPending ? (
          <ScribeListSkeleton />
        ) : consultations.length > 0 ? (
          <div>
            {grouped ? (
              grouped.map(([dateKey, items]) => (
                <div key={dateKey}>
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur px-3 py-2 text-[11px] font-semibold text-foreground/50 uppercase tracking-wider">
                    {formatDateHeader(dateKey)}
                  </div>
                  {items.map((consultation) => (
                    <ScribeListItem
                      key={consultation.id}
                      consultation={consultation}
                      isSelected={selectedId === consultation.id}
                      onClick={() => handleSelect(consultation.id)}
                    />
                  ))}
                </div>
              ))
            ) : (
              consultations.map((consultation) => (
                <ScribeListItem
                  key={consultation.id}
                  consultation={consultation}
                  isSelected={selectedId === consultation.id}
                  onClick={() => handleSelect(consultation.id)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8 pb-31">
            <Empty className="bg-transparent border-none shadow-none flex items-center justify-center">
              <EmptyHeader>
                <div className="bg-primary/10 text-primary w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <EmptyTitle>No Consultations Found</EmptyTitle>
                <EmptyDescription>
                  {searchQuery ? `No results for "${searchQuery}"` : "You haven't created any consultations yet."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </NativeScroll>
    </div>
  )
}

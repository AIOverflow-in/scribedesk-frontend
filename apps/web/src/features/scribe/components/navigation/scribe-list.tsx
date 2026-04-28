import { useState } from "react"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import { ScribeListHeader } from "./scribe-list-header"
import { ScribeListItem } from "./scribe-list-item"
import { 
  Empty, 
  EmptyHeader, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import { Stethoscope } from "lucide-react"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ScribeListProps {
  consultations: Consultation[]
  selectedId?: string
  onSelectConsultation: (id: string) => void
}

export function ScribeList({
  consultations,
  selectedId,
  onSelectConsultation,
}: ScribeListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  let filteredConsultations = consultations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // TEMPORARY: Uncomment the line below to see the empty state
  // filteredConsultations = []

  return (
    <div className="flex flex-col h-full">
      <ScribeListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <NativeScroll className="flex-1">
        {filteredConsultations.length > 0 ? (
          <div>
            {filteredConsultations.map((consultation) => (
              <ScribeListItem
                key={consultation.id}
                consultation={consultation}
                isSelected={selectedId === consultation.id}
                onClick={() => onSelectConsultation(consultation.id)}
              />
            ))}
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

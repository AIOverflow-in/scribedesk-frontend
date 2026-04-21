import { useState } from "react"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { ScribeListHeader } from "./scribe-list-header"
import { ScribeListItem } from "./scribe-list-item"
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

  const filteredConsultations = consultations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <ScribeListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ScrollArea className="flex-1">
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
      </ScrollArea>
    </div>
  )
}

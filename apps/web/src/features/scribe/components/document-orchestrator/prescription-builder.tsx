import * as React from "react"
import { PillBottle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from "@workspace/ui/components/empty"
import type { PrescriptionItem } from "./prescription/types"
import { PrescriptionForm } from "./prescription/prescription-form"
import { PrescriptionItemCard } from "./prescription/prescription-item-card"

export function PrescriptionBuilder({ onGenerate, onBack }: { 
  onGenerate: (data: PrescriptionItem[]) => void
  onBack: () => void 
}) {
  const [items, setItems] = React.useState<PrescriptionItem[]>([])

  const addDrug = (newItem: PrescriptionItem) => {
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-6 py-2">
      <PrescriptionForm onAdd={addDrug} />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Medication List
        </h4>
        
        {items.length === 0 ? (
          <Empty className="py-8 rounded-lg border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-primary/10 text-primary">
                <PillBottle className="h-4 w-4" />
              </EmptyMedia>
              <EmptyTitle className="text-xs">No medications added</EmptyTitle>
              <EmptyDescription className="text-[10px]">
                Enter a drug name above to start your prescription.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="h-[160px] pr-3">
            <div className="space-y-2">
              {items.map((item) => (
                <PrescriptionItemCard 
                  key={item.id} 
                  item={item} 
                  onRemove={removeItem} 
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onBack} className="h-9 px-4 text-sm font-medium cursor-pointer">
          Back
        </Button>
        <Button 
          onClick={() => onGenerate(items)} 
          disabled={items.length === 0} 
          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white border-red-600 h-9 px-4 text-sm font-medium"
        >
          Generate Final Prescription
        </Button>
      </div>
    </div>
  )
}

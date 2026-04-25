import { PillBottle, Clock, Calendar, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import type { PrescriptionItem } from "./types"

interface PrescriptionItemCardProps {
  item: PrescriptionItem
  onRemove: (id: string) => void
}

export function PrescriptionItemCard({ item, onRemove }: PrescriptionItemCardProps) {
  return (
    <div className="group relative flex items-start justify-between p-3 border rounded-md bg-background hover:border-primary/50 transition-colors">
      <div className="space-y-1">
        <p className="text-sm font-bold text-primary">{item.name}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-medium">
          {item.dosage && (
            <span className="flex items-center gap-1">
              <PillBottle className="h-3 w-3" /> {item.dosage}{item.unit} {item.form}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {item.frequency.replace("-", " ")}
          </span>
          {item.duration && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {item.duration} {item.durationUnit}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

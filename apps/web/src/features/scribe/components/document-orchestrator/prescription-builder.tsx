import * as React from "react"
import { Search, PillBottle, Clock, Calendar, Plus, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import { cn } from "@workspace/ui/lib/utils"

interface PrescriptionItem {
  id: string
  name: string
  dosage: string
  unit: string
  form: string
  frequency: string
  duration: string
  durationUnit: string
}

export function PrescriptionBuilder({ onGenerate, onBack }: { 
  onGenerate: (data: PrescriptionItem[]) => void
  onBack: () => void 
}) {
  const [items, setItems] = React.useState<PrescriptionItem[]>([])
  const [searchTerm, setSearchQuery] = React.useState("")
  
  const [currentDrug, setCurrentDrug] = React.useState<Partial<PrescriptionItem>>({
    unit: "mg",
    form: "tablet",
    frequency: "twice-daily",
    durationUnit: "days"
  })

  const addDrug = () => {
    if (!searchTerm) return
    const newItem: PrescriptionItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: searchTerm,
      dosage: currentDrug.dosage || "",
      unit: currentDrug.unit || "mg",
      form: currentDrug.form || "tablet",
      frequency: currentDrug.frequency || "twice-daily",
      duration: currentDrug.duration || "",
      durationUnit: currentDrug.durationUnit || "days"
    }
    setItems([...items, newItem])
    setSearchQuery("")
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-6 py-2">
      {/* 1. Drug Input Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search medicine (e.g. Amoxicillin, Lisinopril...)" 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Dosage</label>
            <div className="flex gap-1">
              <Input 
                placeholder="eg. 500" 
                value={currentDrug.dosage || ""}
                onChange={(e) => setCurrentDrug({...currentDrug, dosage: e.target.value})}
              />
              <Select value={currentDrug.unit} onValueChange={(v) => setCurrentDrug({...currentDrug, unit: v})}>
                <SelectTrigger className="w-[80px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent popper>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="mcg">mcg</SelectItem>
                  <SelectItem value="units">units</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Form</label>
            <Select value={currentDrug.form} onValueChange={(v) => setCurrentDrug({...currentDrug, form: v})}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent popper>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="capsule">Capsule</SelectItem>
                <SelectItem value="syrup">Syrup/Liquid</SelectItem>
                <SelectItem value="injection">Injection</SelectItem>
                <SelectItem value="cream">Cream/Ointment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Frequency</label>
            <Select value={currentDrug.frequency} onValueChange={(v) => setCurrentDrug({...currentDrug, frequency: v})}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent popper>
                <SelectItem value="once-daily">Once Daily (OD)</SelectItem>
                <SelectItem value="twice-daily">Twice Daily (BID)</SelectItem>
                <SelectItem value="three-daily">Three Times (TID)</SelectItem>
                <SelectItem value="four-daily">Four Times (QID)</SelectItem>
                <SelectItem value="as-needed">As Needed (PRN)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Duration</label>
            <div className="flex gap-1">
              <Input 
                placeholder="eg. 7" 
                value={currentDrug.duration || ""}
                onChange={(e) => setCurrentDrug({...currentDrug, duration: e.target.value})}
              />
              <Select value={currentDrug.durationUnit} onValueChange={(v) => setCurrentDrug({...currentDrug, durationUnit: v})}>
                <SelectTrigger className="w-[100px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent popper>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button className="w-full gap-2 cursor-pointer" onClick={addDrug} disabled={!searchTerm}>
          <Plus className="h-4 w-4" /> Add to Prescription
        </Button>
      </div>

      {/* 2. Added Drugs List */}
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
                Search for a drug above to start your prescription.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="h-[160px] pr-3">
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="group relative flex items-start justify-between p-3 border rounded-md bg-background hover:border-primary/50 transition-colors">
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
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onBack} className="h-9 px-4 text-sm font-medium cursor-pointer">Back</Button>
        <Button onClick={() => onGenerate(items)} disabled={items.length === 0} className="cursor-pointer bg-red-600 hover:bg-red-700 text-white border-red-600 h-9 px-4 text-sm font-medium">
          Generate Final Prescription
        </Button>
      </div>
    </div>
  )
}

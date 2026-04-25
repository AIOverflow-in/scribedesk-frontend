import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import type { PrescriptionItem } from "./types"

interface PrescriptionFormProps {
  onAdd: (item: PrescriptionItem) => void
}

export function PrescriptionForm({ onAdd }: PrescriptionFormProps) {
  const [name, setName] = React.useState("")
  const [currentDrug, setCurrentDrug] = React.useState<Partial<PrescriptionItem>>({
    unit: "mg",
    form: "tablet",
    frequency: "twice-daily",
    durationUnit: "days"
  })

  const handleAdd = () => {
    if (!name) return
    
    const newItem: PrescriptionItem = {
      id: crypto.randomUUID(),
      name: name,
      dosage: currentDrug.dosage || "",
      unit: currentDrug.unit || "mg",
      form: currentDrug.form || "tablet",
      frequency: currentDrug.frequency || "twice-daily",
      duration: currentDrug.duration || "",
      durationUnit: currentDrug.durationUnit || "days"
    }
    
    onAdd(newItem)
    setName("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Medicine Name</label>
        <Input 
          placeholder="eg. Paracetamol, Amoxicillin" 
          value={name}
          onChange={(e) => setName(e.target.value)}
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
              <SelectContent position="popper">
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
            <SelectContent position="popper">
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
            <SelectContent position="popper">
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
              <SelectContent position="popper">
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button className="w-full gap-2 cursor-pointer" onClick={handleAdd} disabled={!name}>
        <Plus className="h-4 w-4" /> Add to Prescription
      </Button>
    </div>
  )
}

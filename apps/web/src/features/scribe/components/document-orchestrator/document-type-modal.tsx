import * as React from "react"
import {
  Stethoscope,
  Mail,
  Pill,
  CircleCheck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { useScribe } from "../../context/scribe-context"
import { PrescriptionBuilder } from "./prescription-builder"
import { cn } from "@workspace/ui/lib/utils"

type ModalStep = "CATEGORY" | "ITEM_SPECS" | "RX_BUILDER"

const docTypes = [
  {
    id: "notes",
    title: "Clinical Notes",
    description: "SOAP, HPI, Physical Exam",
    icon: <Stethoscope className="h-5 w-5 text-blue-500" />,
    items: [
      { id: "soap", label: "SOAP Note" },
      { id: "hpi", label: "History of Present Illness" },
      { id: "h-p", label: "History & Physical" },
      { id: "progress", label: "Progress Note" },
      { id: "consultation", label: "Consultation Note" },
      { id: "emergency", label: "Emergency Dept Note" },
    ]
  },
  {
    id: "letters",
    title: "Letters & Reports",
    description: "Referrals, Discharge, Medical Leave",
    icon: <Mail className="h-5 w-5 text-green-500" />,
    items: [
      { id: "referral", label: "Referral Letter" },
      { id: "discharge", label: "Discharge Summary" },
      { id: "medical-leave", label: "Medical Leave Certificate" },
      { id: "return-work", label: "Return to Work" },
      { id: "doctors-note", label: "Doctor's Note" },
      { id: "fit-to-travel", label: "Fit to Travel" },
    ]
  },
  {
    id: "prescriptions",
    title: "Prescription",
    description: "Search medicine, Dosage, Instructions",
    icon: <Pill className="h-5 w-5 text-red-500" />,
    isDirect: true
  }
]

export function DocumentTypeModal() {
  const { isDocModalOpen, closeDocModal, generateDocument } = useScribe()
  const [step, setStep] = React.useState<ModalStep>("CATEGORY")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null)
  const [context, setContext] = React.useState("")

  React.useEffect(() => {
    if (!isDocModalOpen) {
      const timer = setTimeout(() => {
        setStep("CATEGORY")
        setSelectedCategory(null)
        setSelectedItem(null)
        setContext("")
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isDocModalOpen])

  const handleCategorySelect = (catId: string) => {
    const cat = docTypes.find(c => c.id === catId)
    setSelectedCategory(catId)
    if (cat?.isDirect) {
      setStep("RX_BUILDER")
    } else {
      setStep("ITEM_SPECS")
    }
  }

  const handleBack = () => {
    if (step === "ITEM_SPECS" || step === "RX_BUILDER") {
      setStep("CATEGORY")
      setSelectedCategory(null)
      setSelectedItem(null)
    }
  }

  const onGenerateRx = (items: any[]) => {
     generateDocument("prescription", { items })
  }

  const selectedItemLabel = docTypes
    .flatMap(c => c.items || [])
    .find(i => i.id === selectedItem)?.label

  return (
    <Dialog open={isDocModalOpen} onOpenChange={closeDocModal}>
      <DialogContent className="sm:max-w-[500px] transition-all duration-300 [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === "RX_BUILDER" ? "New Prescription" : "Create Clinical Document"}
          </DialogTitle>
          <DialogDescription>
            {step === "CATEGORY" && "Select the type of document you want to generate."}
            {step === "ITEM_SPECS" && (
              selectedItem 
                ? `Provide specific details to refine your ${selectedItemLabel}.` 
                : `Select a document subtype and add context.`
            )}
            {step === "RX_BUILDER" && "Add medicines and instructions below."}
          </DialogDescription>
        </DialogHeader>

        <div>
          {step === "CATEGORY" && (
            <div className="grid grid-cols-1 divide-y border rounded-md overflow-hidden mb-6">
              {docTypes.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="flex items-start gap-4 p-4 text-left transition-colors hover:bg-accent cursor-pointer"
                >
                  <span className="mt-1 rounded-md bg-muted p-2 block">{cat.icon}</span>
                  <span className="flex-1 block">
                    <span className="font-medium block text-foreground">{cat.title}</span>
                    <span className="text-sm text-muted-foreground block">{cat.description}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === "ITEM_SPECS" && (
            <div className="space-y-4">
               <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Additional Context (Optional)</label>
                <Textarea
                  placeholder="e.g., focus more on the side effects from earlier medication..."
                  className="min-h-[80px] max-h-[200px]"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 divide-y border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
                {docTypes.find(c => c.id === selectedCategory)?.items?.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors cursor-pointer",
                      selectedItem === item.id ? "bg-primary/5 text-foreground" : "hover:bg-accent"
                    )}
                  >
                    <span className="text-foreground">{item.label}</span>
                    {selectedItem === item.id && <CircleCheck className="h-5 w-5 text-green-600" />}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={handleBack} className="cursor-pointer">Back</Button>
                <Button 
                  onClick={() => generateDocument(selectedItem!, context)} 
                  disabled={!selectedItem}
                  className="cursor-pointer"
                >
                  Generate
                </Button>
              </div>
            </div>
          )}

          {step === "RX_BUILDER" && (
            <PrescriptionBuilder 
              onBack={handleBack} 
              onGenerate={onGenerateRx} 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

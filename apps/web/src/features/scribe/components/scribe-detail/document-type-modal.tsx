import * as React from "react"
import {
  Stethoscope,
  Mail,
  Pill,
  ChevronLeft,
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
import { useScribe } from "../../context/scribe-context"
import { cn } from "@workspace/ui/lib/utils"

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
    ]
  },
  {
    id: "prescriptions",
    title: "Prescriptions",
    description: "Medicines, Dosage, Frequency",
    icon: <Pill className="h-5 w-5 text-red-500" />,
    items: [
      { id: "prescription", label: "New Prescription" },
      { id: "refill", label: "Prescription Refill" },
      { id: "medication-list", label: "Medication List" },
    ]
  }
]

export function DocumentTypeModal() {
  const { isDocModalOpen, closeDocModal, generateDocument } = useScribe()
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null)
  const [context, setContext] = React.useState("")

  // Reset state after the modal has finished closing to prevent "abrupt" content jumps
  React.useEffect(() => {
    if (!isDocModalOpen) {
      const timer = setTimeout(() => {
        setSelectedCategory(null)
        setSelectedItem(null)
        setContext("")
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isDocModalOpen])

  const handleGenerate = () => {
    if (selectedItem) {
      generateDocument(selectedItem, context)
    }
  }

  const handleBack = () => {
    setSelectedCategory(null)
    setSelectedItem(null)
    setContext("")
  }

  const handleClose = () => {
    closeDocModal()
  }

  return (
    <Dialog open={isDocModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Clinical Document</DialogTitle>
          <DialogDescription>
            {selectedCategory 
              ? "Select a document type and add optional context."
              : "Select the type of document you want to generate."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!selectedCategory ? (
            <div key="category-list" className="grid grid-cols-1 divide-y divide-border pb-4">
              {docTypes.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex items-start gap-4 p-4 -mx-4 text-left transition-colors hover:bg-accent cursor-pointer"
                >
                  <span className="mt-1 rounded-md bg-muted p-2 block">
                    {cat.icon}
                  </span>
                  <span className="flex-1 block">
                    <span className="font-medium block">{cat.title}</span>
                    <span className="text-sm text-muted-foreground block">{cat.description}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div key="item-selection" className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Additional Context (Optional)
                </label>
                <textarea
                  placeholder="e.g., focus more on the side effects from earlier medication..."
                  className="min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <div className={cn(
                "grid grid-cols-1",
                !selectedItem && "divide-y divide-border"
              )}>
                {docTypes.find(c => c.id === selectedCategory)?.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors cursor-pointer group",
                      selectedItem === item.id
                        ? "bg-primary/5 border border-primary rounded-md"
                        : "hover:bg-accent"
                    )}
                  >
                    <span>{item.label}</span>
                    {selectedItem === item.id && (
                      <CircleCheck className="h-5 w-5 text-green-600" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="cursor-pointer gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedItem}
                  className="cursor-pointer"
                >
                  Generate
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


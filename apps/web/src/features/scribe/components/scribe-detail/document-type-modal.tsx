import * as React from "react"
import {
  FileText,
  Stethoscope,
  FilePlus,
  Mail,
  ClipboardList,
  Pill,
  FileSearch,
  MessageSquarePlus,
  ChevronLeft
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
    ]
  },
  {
    id: "prescriptions",
    title: "Prescriptions",
    description: "Medicines, Dosage, Frequency",
    icon: <Pill className="h-5 w-5 text-red-500" />,
    items: [
      { id: "prescription", label: "New Prescription" },
    ]
  }
]

export function DocumentTypeModal() {
  const { isDocModalOpen, closeDocModal, generateDocument } = useScribe()
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null)
  const [context, setContext] = React.useState("")

  const handleGenerate = () => {
    if (selectedItem) {
      generateDocument(selectedItem, context)
      setContext("")
      setSelectedCategory(null)
      setSelectedItem(null)
    }
  }

  const handleBack = () => {
    setSelectedCategory(null)
    setSelectedItem(null)
    setContext("")
  }

  const handleClose = () => {
    closeDocModal()
    setSelectedCategory(null)
    setSelectedItem(null)
    setContext("")
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
            <div className="grid grid-cols-1 gap-3">
              {docTypes.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex items-start gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent cursor-pointer"
                >
                  <div className="mt-1 rounded-md bg-muted p-2">
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{cat.title}</div>
                    <div className="text-sm text-muted-foreground">{cat.description}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
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

              <div className="grid grid-cols-1 gap-2">
                {docTypes.find(c => c.id === selectedCategory)?.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-4 py-3 text-sm font-medium transition-colors cursor-pointer",
                      selectedItem === item.id
                        ? "bg-primary/5 border-primary text-primary"
                        : "hover:bg-accent"
                    )}
                  >
                    {item.label}
                    <FilePlus className={cn(
                      "h-4 w-4",
                      selectedItem === item.id ? "text-primary" : "text-muted-foreground"
                    )} />
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


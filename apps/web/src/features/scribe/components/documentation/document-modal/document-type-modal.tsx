import * as React from "react"
import { useState, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
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
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { useScribe } from "../../../context/scribe-context"
import { useCreateReport } from "../../../hooks/use-scribe-reports"
import { useTemplates } from "@workspace/hooks/template"
import { apiClient } from "@/lib/api-client"
import { cn } from "@workspace/ui/lib/utils"
import { PrescriptionBuilder } from "../prescription/prescription-builder"
import type { PrescriptionItem } from "../prescription/types"

type ModalStep = "CATEGORY" | "ITEM_SPECS" | "RX_BUILDER"

const rootTypes = [
  {
    id: "notes",
    title: "Clinical Notes",
    description: "SOAP, HPI, Physical Exam",
    icon: <Stethoscope className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "letters",
    title: "Letters & Reports",
    description: "Referrals, Discharge, Medical Leave",
    icon: <Mail className="h-5 w-5 text-green-500" />,
  },
  {
    id: "prescription",
    title: "Prescription",
    description: "Medicine, Dosage, Instructions",
    icon: <Pill className="h-5 w-5 text-red-500" />,
    isDirect: true,
  },
]

function formatPrescriptionContext(items: PrescriptionItem[]): string {
  return items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} ${item.dosage}${item.unit} ${item.form}, ${item.frequency.replace("-", " ")}, ${item.duration ? `${item.duration} ${item.durationUnit}` : "as directed"}`
    )
    .join("\n")
}

export function DocumentTypeModal() {
  const queryClient = useQueryClient()
  const { isDocModalOpen, closeDocModal, consultation, openSheet } = useScribe()
  const [step, setStep] = useState<ModalStep>("CATEGORY")
  const [selectedRootType, setSelectedRootType] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [context, setContext] = useState("")

  const { data: templates, isLoading } = useTemplates(apiClient)
  const createReport = useCreateReport()

  const filteredTemplates = useMemo(() => {
    if (!templates || !selectedRootType) return []
    return templates.filter((t: any) => t.root_type === selectedRootType)
  }, [templates, selectedRootType])

  const prescriptionTemplate = useMemo(() => {
    if (!templates) return null
    return templates.find((t: any) => t.root_type === "prescription") ?? null
  }, [templates])

  React.useEffect(() => {
    if (!isDocModalOpen) {
      const timer = setTimeout(() => {
        setStep("CATEGORY")
        setSelectedRootType(null)
        setSelectedTemplateId(null)
        setContext("")
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isDocModalOpen])

  const handleCategorySelect = (catId: string) => {
    const cat = rootTypes.find((c) => c.id === catId)
    setSelectedRootType(catId)
    if (cat?.isDirect) {
      setStep("RX_BUILDER")
    } else {
      setStep("ITEM_SPECS")
    }
  }

  const handleBack = () => {
    if (step === "ITEM_SPECS" || step === "RX_BUILDER") {
      setStep("CATEGORY")
      setSelectedRootType(null)
      setSelectedTemplateId(null)
    }
  }

  const handleGenerate = () => {
    if (!selectedTemplateId || !consultation) return

    createReport.mutate(
      {
        session_id: consultation.id,
        template_id: selectedTemplateId,
        additional_context: context || undefined,
      },
      {
        onSuccess: (report: any) => {
          queryClient.invalidateQueries({ queryKey: ["session", consultation.id] })
          queryClient.invalidateQueries({ queryKey: ["sessions"] })
          closeDocModal()
          openSheet({
            id: report.id,
            title: report.title,
            type: report.title,
            createdAt: report.created_at,
            content: report.content,
          })
        },
      }
    )
  }

  const handleGenerateRx = (items: PrescriptionItem[]) => {
    if (!consultation || !prescriptionTemplate) return

    const rxContext = formatPrescriptionContext(items)

    createReport.mutate(
      {
        session_id: consultation.id,
        template_id: prescriptionTemplate.id,
        additional_context: rxContext,
      },
      {
        onSuccess: (report: any) => {
          queryClient.invalidateQueries({ queryKey: ["session", consultation.id] })
          queryClient.invalidateQueries({ queryKey: ["sessions"] })
          closeDocModal()
          openSheet({
            id: report.id,
            title: report.title,
            type: report.title,
            createdAt: report.created_at,
            content: report.content,
          })
        },
      }
    )
  }

  return (
    <Dialog open={isDocModalOpen} onOpenChange={closeDocModal}>
      <DialogContent className="sm:max-w-[500px] transition-all duration-300 [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === "RX_BUILDER" ? "New Prescription" : "Create Clinical Document"}
          </DialogTitle>
          <DialogDescription>
            {step === "CATEGORY" && "Select the type of document you want to generate."}
            {step === "ITEM_SPECS" && "Select a template and add optional context."}
            {step === "RX_BUILDER" && "Add medicines and instructions below."}
          </DialogDescription>
        </DialogHeader>

        {step === "CATEGORY" && (
          <div className="grid grid-cols-1 divide-y border rounded-md overflow-hidden mb-6">
            {rootTypes.map((cat) => (
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

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading templates...</p>
            ) : (
              <ScrollArea className="max-h-[300px]">
                <div className="grid grid-cols-1 divide-y border rounded-md overflow-hidden">
                  {filteredTemplates.map((tpl: any) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors cursor-pointer w-full text-left",
                        selectedTemplateId === tpl.id ? "bg-primary/5 text-foreground" : "hover:bg-accent"
                      )}
                    >
                      <div>
                        <span className="text-foreground">{tpl.name}</span>
                        {tpl.is_system && (
                          <span className="ml-2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">System</span>
                        )}
                      </div>
                      {selectedTemplateId === tpl.id && <CircleCheck className="h-5 w-5 text-green-600 shrink-0" />}
                    </button>
                  ))}
                  {filteredTemplates.length === 0 && (
                    <p className="p-4 text-sm text-muted-foreground">No templates found for this type.</p>
                  )}
                </div>
              </ScrollArea>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleBack} className="cursor-pointer">Back</Button>
              <Button
                onClick={handleGenerate}
                disabled={!selectedTemplateId || createReport.isPending}
                className="cursor-pointer"
              >
                {createReport.isPending ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        )}

        {step === "RX_BUILDER" && (
          <PrescriptionBuilder
            onBack={handleBack}
            onGenerate={handleGenerateRx}
            isGenerating={createReport.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

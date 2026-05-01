import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ClinicalLexicalEditor } from "@/shared/components/clinical-editor"
import { useCreateTemplate } from "../hooks/use-templates"
import type { CreateTemplateRequest } from "@workspace/schemas"
import { toast } from "@workspace/ui/components/sonner"

const ROOT_TYPES = ["notes", "letters", "prescription"] as const

interface CreateTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTemplateModal({ open, onOpenChange }: CreateTemplateModalProps) {
  const queryClient = useQueryClient()
  const [name, setName] = React.useState("")
  const [rootType, setRootType] = React.useState<string>("")
  const [content, setContent] = React.useState("")

  const createTemplate = useCreateTemplate()

  const isValid = name && rootType

  const reset = () => {
    setName("")
    setRootType("")
    setContent("")
  }

  const handleCreate = () => {
    if (!isValid) return
    const data: CreateTemplateRequest = {
      name,
      root_type: rootType as "notes" | "letters" | "prescription",
      content,
    }
    createTemplate.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["templates"] })
        toast.success("Template created")
        reset()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to create template")
      },
    })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) reset()
    onOpenChange(open)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[50vw]! sm:max-w-none! p-0 flex flex-col h-full border-l overflow-hidden [&>button]:hidden"
      >
        {/* Header */}
        <div className="shrink-0 bg-background border-b h-11 flex items-center justify-between px-5">
          <SheetTitle className="text-sm font-semibold">Create Template</SheetTitle>
          <Button variant="outline" size="icon" onClick={() => handleOpenChange(false)} className="h-7 w-7 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Name + Type Fields & Editor */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="shrink-0 px-5 pt-5 pb-5 flex gap-4">
            <Field className="flex-1">
              <FieldLabel className="text-muted-foreground font-medium text-xs">Name</FieldLabel>
              <Input
                className="rounded-md h-8 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Custom SOAP Note"
              />
            </Field>

            <Field className="w-[180px]">
              <FieldLabel className="text-muted-foreground font-medium text-xs">Type</FieldLabel>
              <Select value={rootType} onValueChange={setRootType}>
                <SelectTrigger className="rounded-md h-8 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOT_TYPES.map((rt) => (
                    <SelectItem key={rt} value={rt} className="capitalize text-sm">
                      {rt.charAt(0).toUpperCase() + rt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              <ClinicalLexicalEditor
                initialContent=""
                onChange={setContent}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="h-14 border-t flex items-center justify-end px-4 gap-2 bg-background shrink-0">
          <Button variant="outline" size="sm" className="cursor-pointer font-medium" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" className="cursor-pointer px-6 font-medium" disabled={!isValid || createTemplate.isPending} onClick={handleCreate}>
            {createTemplate.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { FileText } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
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

  const createTemplate = useCreateTemplate()

  const isValid = name && rootType

  const handleCreate = () => {
    if (!isValid) return
    const data: CreateTemplateRequest = {
      name,
      root_type: rootType as "notes" | "letters" | "prescription",
      content: "",
    }
    createTemplate.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["templates"] })
        toast.success("Template created")
        setName("")
        setRootType("")
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to create template")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden [&>button]:cursor-pointer">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-bold">Create Template</DialogTitle>
          <p className="text-sm text-muted-foreground">Create a new clinical documentation template.</p>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-5">
          <Field>
            <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" /> Template name
            </FieldLabel>
            <Input
              className="rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Custom SOAP Note"
            />
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground font-medium text-xs flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" /> Type
            </FieldLabel>
            <Select value={rootType} onValueChange={setRootType}>
              <SelectTrigger className="rounded-md">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ROOT_TYPES.map((rt) => (
                  <SelectItem key={rt} value={rt} className="capitalize">
                    {rt.charAt(0).toUpperCase() + rt.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="p-4 flex justify-end gap-3 shrink-0 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!isValid || createTemplate.isPending}
            onClick={handleCreate}
          >
            {createTemplate.isPending ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

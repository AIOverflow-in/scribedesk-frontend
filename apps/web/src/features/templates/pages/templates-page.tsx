import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { FilePlus, FileText } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import { Spinner } from "@workspace/ui/components/spinner"
import { PageHeader } from "@/shared/components/page-header"
import { useTemplates, useDeleteTemplate } from "../hooks/use-templates"
import { TemplateListItem } from "../components/template-list-item"
import { TemplateSearch } from "../components/template-search"
import { TemplateDetailSheet } from "../components/template-detail-sheet"
import { CreateTemplateModal } from "../components/create-template-modal"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from "@workspace/ui/components/empty"
import type { Template } from "../types"
import { toast } from "@workspace/ui/components/sonner"

export function TemplatesPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null)
  const [createModalOpen, setCreateModalOpen] = React.useState(false)

  const { data: templates, isLoading } = useTemplates()
  const deleteTemplate = useDeleteTemplate()

  const filteredTemplates = React.useMemo(() => {
    if (!templates) return []
    if (!searchQuery.trim()) return templates
    const q = searchQuery.toLowerCase()
    return templates.filter((t: Template) =>
      t.name.toLowerCase().includes(q) ||
      t.root_type.toLowerCase().includes(q)
    )
  }, [templates, searchQuery])

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate.mutate(templateId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["templates"] })
        toast.success("Template deleted")
        if (selectedTemplate?.id === templateId) setSelectedTemplate(null)
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to delete template")
      },
    })
  }

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-8 py-10 gap-8">
      <PageHeader
        title="Templates"
        description="Manage clinical documentation templates and reports."
        actions={
          <Button
            className="gap-2 h-9 px-4 font-semibold shadow-sm cursor-pointer"
            onClick={() => setCreateModalOpen(true)}
          >
            <FilePlus className="h-4 w-4" />
            Create Template
          </Button>
        }
      >
        <TemplateSearch value={searchQuery} onChange={setSearchQuery} />
      </PageHeader>

      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : filteredTemplates.length > 0 ? (
          <NativeScroll className="h-full flex-1">
            <div className="flex flex-col mb-10 [&>*:hover]:border-t-transparent [&>*:hover+*]:border-t-transparent [&>*:first-child]:border-t-0 *:border-t *:border-border">
              {filteredTemplates.map((template) => (
                <TemplateListItem
                  key={template.id}
                  template={template}
                  onClick={() => setSelectedTemplate(template)}
                  onDelete={handleDeleteTemplate}
                />
              ))}
            </div>
          </NativeScroll>
        ) : (
          <div className="py-20">
            <Empty className="border-none bg-transparent">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-16 bg-primary/10 text-primary shadow-xs">
                  <FileText className="size-8" />
                </EmptyMedia>
                <EmptyTitle className="text-lg">No templates found</EmptyTitle>
                <EmptyDescription>
                  {searchQuery ? `No templates match "${searchQuery}"` : "You haven't created any templates yet."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </div>

      <TemplateDetailSheet
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />

      <CreateTemplateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  )
}

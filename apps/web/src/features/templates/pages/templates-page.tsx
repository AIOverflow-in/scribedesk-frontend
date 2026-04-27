import * as React from "react"
import { FilePlus, FileText } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { DashboardLayout } from "@/shared/layout/dashboard-layout"
import { PageHeader } from "@/shared/components/page-header"
import { mockTemplates } from "../data/mock-templates"
import { TemplateListItem } from "../components/template-list-item"
import { TemplateSearch } from "../components/template-search"
import { TemplateDetailSheet } from "../components/template-detail-sheet"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import type { Template } from "../types"

export function TemplatesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null)

  const filteredTemplates = mockTemplates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-8 py-10 gap-8">
        <PageHeader 
          title="Templates" 
          description="Manage clinical documentation templates and reports."
          actions={
            <Button 
              className="gap-2 h-9 px-4 font-semibold shadow-sm cursor-pointer"
            >
              <FilePlus className="h-4 w-4" />
              Create Template
            </Button>
          }
        >
          <TemplateSearch value={searchQuery} onChange={setSearchQuery} />
        </PageHeader>

        {/* List Area */}
        <div className="flex-1 min-h-0">
          {filteredTemplates.length > 0 ? (
            <ScrollArea className="flex-1">
              <div className="flex flex-col mb-10 [&>*:hover]:border-t-transparent [&>*:hover+*]:border-t-transparent [&>*:first-child]:border-t-0 [&>*]:border-t [&>*]:border-border">
                {filteredTemplates.map((template) => (
                  <TemplateListItem
                    key={template.id}
                    template={template}
                    onClick={() => setSelectedTemplate(template)}
                  />
                ))}
              </div>
            </ScrollArea>
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
      </div>

      <TemplateDetailSheet 
        template={selectedTemplate} 
        onClose={() => setSelectedTemplate(null)} 
      />
    </DashboardLayout>
  )
}

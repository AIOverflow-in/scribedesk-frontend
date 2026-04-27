import * as React from "react"
import { 
  Copy, 
  CircleCheck,
  X 
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { ClinicalLexicalEditor } from "@/shared/components/clinical-editor"
import { cn } from "@workspace/ui/lib/utils"
import type { Template } from "../types"
import { NativeScroll } from "@workspace/ui/components/native-scroll"

interface TemplateDetailSheetProps {
  template: Template | null
  onClose: () => void
}

export function TemplateDetailSheet({ template, onClose }: TemplateDetailSheetProps) {
  const [editedContent, setEditedContent] = React.useState("")
  const [editedText, setEditedText] = React.useState("")
  const [editedHtml, setEditedHtml] = React.useState("")
  const [isCopied, setIsCopied] = React.useState(false)

  // Preservation of data during exit animation
  const lastTemplate = React.useRef(template)
  if (template) lastTemplate.current = template
  const t = template || lastTemplate.current

  React.useEffect(() => {
    if (template) {
      setEditedContent(template.content)
      setEditedText(template.content)
      setEditedHtml(template.content)
    }
  }, [template?.id])

  const handleCopy = async () => {
    const text = editedText || editedContent
    if (!text) return
    
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleSave = () => {
    console.log("Saving template:", editedContent)
    onClose()
  }

  if (!t) return null

  return (
    <Sheet open={!!template} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[50vw]! sm:max-w-none! p-0 flex flex-col h-full border-l overflow-hidden [&>button]:hidden"
      >
        {/* Toolbar Header */}
        <div className="shrink-0 bg-background border-b h-11 flex items-center justify-between px-3">
          <SheetTitle className="text-sm font-semibold truncate pr-4">
            {t.title}
          </SheetTitle>

          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 cursor-pointer" 
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <div className="relative h-3.5 w-3.5">
                <Copy className={cn(
                  "absolute inset-0 h-3.5 w-3.5 transition-all duration-300 transform",
                  isCopied ? "opacity-0 scale-75 rotate-45" : "opacity-100 scale-100 rotate-0"
                )} />
                <CircleCheck className={cn(
                  "absolute inset-0 h-3.5 w-3.5 text-green-600 transition-all duration-300 transform",
                  isCopied ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-45"
                )} />
              </div>
            </Button>
            <Button variant="outline" size="icon" onClick={onClose} className="h-7 w-7 cursor-pointer ml-1">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 min-h-0 bg-muted/50 flex flex-col items-center px-5 pt-3 pb-4 md:px-8 md:pt-7 md:pb-8">
           <div className="w-full max-w-[850px] bg-white shadow-sm border rounded-sm flex-1 flex flex-col overflow-hidden text-slate-900">
             <div className="flex-1 flex flex-col min-h-0">
               <ClinicalLexicalEditor
                 initialContent={t.content}
                 onChange={setEditedContent}
                 onTextChange={setEditedText}
                 onHtmlChange={setEditedHtml}
               />
             </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="h-14 border-t flex items-center justify-end px-4 gap-2 bg-background shrink-0">
          <Button variant="outline" size="sm" className="cursor-pointer font-medium" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="cursor-pointer px-6 font-medium" onClick={handleSave}>
            Save Template
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

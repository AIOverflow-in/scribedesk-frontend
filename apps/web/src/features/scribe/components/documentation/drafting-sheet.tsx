import * as React from "react"
import {
  Copy,
  CircleCheck,
  Printer,
  CheckCircle2,
  Lock,
  X,
  ChevronDown,
  FileSignature,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import {
  ButtonGroup,
} from "@workspace/ui/components/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import { useScribe } from "../../context/scribe-context"
import { cn } from "@workspace/ui/lib/utils"
import { ClinicalPaper } from "./clinical-paper"
import { ClinicalPaperSkeleton } from "./clinical-paper-skeleton"

export function DraftingSheet() {
  const { isSheetOpen, closeSheet, activeDocument } = useScribe()
  const [isSigned, setIsSigned] = React.useState(false)
  const [showSignature, setShowSignature] = React.useState(true)
  const [isGenerating, setIsGenerating] = React.useState(true)
  const [isCopied, setIsCopied] = React.useState(false)
  const [editedContent, setEditedContent] = React.useState("")
  const [editedText, setEditedText] = React.useState("")
  const [editedHtml, setEditedHtml] = React.useState("")

  // Keep a reference to the last document to prevent content disappearing during exit animation
  const lastDoc = React.useRef(activeDocument)
  if (activeDocument) lastDoc.current = activeDocument
  const docToRender = activeDocument || lastDoc.current

  // Simulate generation only if the document has no content yet
  React.useEffect(() => {
    if (isSheetOpen) {
      if (docToRender?.content) {
        setIsGenerating(false)
        setEditedContent(docToRender.content)
        setEditedText(docToRender.content)
        setEditedHtml(docToRender.content)
      } else {
        setIsGenerating(true)
        setIsSigned(false)
        if (!docToRender?.id) {
          // No document at all — fallback timer
          const timer = setTimeout(() => {
            setIsGenerating(false)
          }, 1500)
          return () => clearTimeout(timer)
        }
      }
    }
  }, [isSheetOpen, activeDocument?.id, activeDocument?.content])

  const handleCopy = async () => {
    const plainText = editedText || editedContent || docToRender?.content || ""
    const htmlText = editedHtml || plainText
    
    if (!plainText) return

    try {
      const typeText = "text/plain"
      const typeHtml = "text/html"
      const blobText = new Blob([plainText], { type: typeText })
      const blobHtml = new Blob([htmlText], { type: typeHtml })
      
      const data = [new ClipboardItem({
        [typeText]: blobText,
        [typeHtml]: blobHtml,
      })]
      
      await navigator.clipboard.write(data)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      // Fallback to plain text only if ClipboardItem fails (some browsers)
      try {
        await navigator.clipboard.writeText(plainText)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (fallbackErr) {
        console.error("Failed to copy text: ", fallbackErr)
      }
    }
  }

  const handleSave = () => {
    console.log("Saving document with content:", editedContent)
    closeSheet()
  }

  const handlePrint = () => {
    window.print()
  }

  if (!docToRender) return null

  return (
    <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
      <SheetContent
        side="right"
        className="w-full sm:w-[50vw]! sm:max-w-none! p-0 flex flex-col h-full border-l overflow-hidden [&>button]:hidden no-print"
      >
        {/* Toolbar Header */}
        <div className="shrink-0 bg-background border-b h-11 flex items-center justify-between px-3">
          <SheetTitle className="text-sm font-semibold truncate pr-4">
            {isGenerating ? "Generating Document..." : docToRender.title}
          </SheetTitle>

          <div className="flex items-center gap-1">
            {!isSigned ? (
              <ButtonGroup className="gap-0!">
                <Button
                  size="sm"
                  className="h-7 px-3 bg-green-600 hover:bg-green-700 border border-green-600 text-white cursor-pointer text-xs gap-2 rounded-r-none! z-10"
                  onClick={() => setIsSigned(true)}
                  disabled={!showSignature || isGenerating}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Sign
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild disabled={isGenerating}>
                    <Button variant="outline" className="h-7 w-7 p-0 cursor-pointer rounded-l-none! border-l-0! focus-visible:ring-0">
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setShowSignature(!showSignature)}>
                      <FileSignature className={cn("h-4 w-4", showSignature ? "text-primary" : "text-muted-foreground")} />
                      <span className="flex-1">Include Signature</span>
                      {showSignature && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonGroup>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-medium uppercase tracking-tight">
                <Lock className="h-3 w-3" /> Signed
              </div>
            )}
            
            <div className="h-3.5 w-px bg-border mx-1" />
            
            <Button variant="outline" size="icon" className="h-7 w-7 cursor-pointer" onClick={handlePrint} disabled={isGenerating}>
              <Printer className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 cursor-pointer" 
              onClick={handleCopy}
              disabled={isGenerating}
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
            <Button variant="outline" size="icon" onClick={closeSheet} className="h-7 w-7 cursor-pointer ml-1">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Clinical Workspace (The Paper or Skeleton) */}
        <div className="flex-1 min-h-0 bg-gray-100 dark:bg-gray-900 no-print flex flex-col items-center px-5 pt-3 pb-4 md:px-8 md:pt-7 md:pb-8">
            {isGenerating ? (
              <ClinicalPaperSkeleton />
            ) : (
              <ClinicalPaper 
                document={docToRender}
                isSigned={isSigned}
                showSignature={showSignature}
                onContentChange={setEditedContent}
                onTextChange={setEditedText}
                onHtmlChange={setEditedHtml}
                currentHtml={editedHtml}
              />
            )}
        </div>

        {/* Footer Actions */}
        <div className="h-14 border-t flex items-center justify-end px-4 gap-2 bg-background shrink-0">
          <Button variant="outline" size="sm" className="cursor-pointer" onClick={closeSheet}>
            Cancel
          </Button>
          <Button size="sm" className="cursor-pointer" disabled={isGenerating} onClick={handleSave}>
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

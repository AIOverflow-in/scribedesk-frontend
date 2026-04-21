import * as React from "react"
import {
  Download,
  Printer,
  CheckCircle2,
  Lock,
  X,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { useScribe } from "../../context/scribe-context"
import { cn } from "@workspace/ui/lib/utils"

export function DraftingSheet() {
  const { isSheetOpen, closeSheet, activeDocument } = useScribe()
  const [isSigned, setIsSigned] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)

  const lastDoc = React.useRef(activeDocument)
  if (activeDocument) {
    lastDoc.current = activeDocument
  }

  const docToRender = activeDocument || lastDoc.current

  if (!docToRender) return null

  return (
    <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
      <SheetContent
        side="right"
        className="w-full sm:w-[50vw]! sm:max-w-none! p-0 flex flex-col h-full border-l overflow-hidden [&>button]:hidden"
      >
        {/* Header Section with title and actions */}
        <div className="shrink-0 bg-background border-b">
          <div className="h-11 flex items-center justify-between px-3">
            {/* Title */}
            <SheetTitle className="text-base font-semibold truncate pr-4">
              {docToRender.title}
            </SheetTitle>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {!isSigned ? (
                <Button
                  size="sm"
                  className="h-7 gap-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer text-xs"
                  onClick={() => setIsSigned(true)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Sign
                </Button>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-medium uppercase tracking-tight">
                  <Lock className="h-3 w-3" />
                  Signed
                </div>
              )}
              <div className="h-3.5 w-px bg-border mx-1" />
              <Button variant="outline" size="icon" className="h-7 w-7 cursor-pointer">
                <Download className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7 cursor-pointer">
                <Printer className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="icon" onClick={closeSheet} className="h-7 w-7 cursor-pointer ml-1">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 min-h-0 bg-gray-100 dark:bg-gray-900">
          <ScrollArea className="h-full">
          <div className="py-6 px-6 md:px-8 flex justify-center">
            {/* The "Paper" */}
            <div className={cn(
              "w-full max-w-[1000px] bg-white shadow-sm border rounded-sm flex flex-col min-h-[1200px]",
              isSigned && "ring-1 ring-blue-100"
            )}>
              {/* Paper Header - Significantly Reduced Padding, Circular Logo */}
              <div className="py-4 px-8 md:py-5 md:px-10 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <h1 className="font-bold text-base leading-tight text-gray-900">Acme Medical Center</h1>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Clinical Documentation</p>
                  </div>
                </div>
              </div>

              {/* Paper Content */}
              <div className="flex-1 p-10 py-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">{docToRender.type?.replace("-", " ")}</h2>
                  <div className="h-1 w-12 bg-primary mt-2 rounded-full" />
                </div>

                <div className="space-y-6 text-[13px] text-gray-700 leading-relaxed">
                  <div className={cn(
                    "min-h-[500px] outline-none",
                    isSigned && "pointer-events-none opacity-90"
                  )}>
                    <p className="text-muted-foreground italic mb-4">
                      [Generation starting... Imagine a Lexical editor here with AI generated {docToRender.type} content]
                    </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>
                    <p className="mt-4">Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet.</p>
                  </div>
                </div>
              </div>

              {/* Paper Footer / Signature */}
              <div className="p-10 pt-0 mt-auto">
                <div className="flex flex-col items-start mb-8">
                  {isSigned && (
                    <div className="mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="font-heading text-2xl text-blue-900/80 -rotate-2 select-none italic tracking-tight underline decoration-blue-200 decoration-1 underline-offset-4">
                        Alex Care
                      </div>
                      <div className="text-[9px] text-blue-600/50 mt-1 font-semibold uppercase tracking-widest">
                        Digital Verification
                      </div>
                    </div>
                  )}
                  <div className="w-48 border-t border-gray-200 pt-3">
                    <p className="text-sm font-bold text-gray-900">Dr. Alexander Care</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Medical Practitioner</p>
                  </div>
                </div>

                {/* Multi-line Address/Contact */}
                <div className="border-t pt-6 text-[10px] text-muted-foreground leading-relaxed flex justify-between items-end">
                  <div>
                    <p className="font-semibold text-gray-600">Acme Medical Center</p>
                    <p>123 Healthcare Way, Suite 500</p>
                    <p>New York, NY 10001</p>
                  </div>
                  <div className="text-right">
                    <p>Tel: (555) 123-4567</p>
                    <p>Email: info@acme-medical.com</p>
                    <p>www.acme-medical.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </ScrollArea>
        </div>

        {/* Footer Section - Only show when there are changes and document is not signed */}
        {hasChanges && !isSigned && (
          <div className="h-14 border-t flex items-center justify-end px-4 gap-2 bg-background shrink-0">
            <Button variant="outline" className="cursor-pointer" onClick={() => setHasChanges(false)}>
              Discard
            </Button>
            <Button className="cursor-pointer">
              Save
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

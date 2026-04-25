import * as React from "react"
import { createPortal } from "react-dom"
import {
  Download,
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
import { ScrollArea } from "@workspace/ui/components/scroll-area"
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

export function DraftingSheet() {
  const { isSheetOpen, closeSheet, activeDocument } = useScribe()
  const [isSigned, setIsSigned] = React.useState(false)
  const [showSignature, setShowSignature] = React.useState(true)

  const lastDoc = React.useRef(activeDocument)
  if (activeDocument) {
    lastDoc.current = activeDocument
  }

  const docToRender = activeDocument || lastDoc.current

  const handlePrint = () => {
    window.print()
  }

  if (!docToRender) return null

  const printDocument = typeof document !== 'undefined' ? createPortal(
    <div className="print-only-container font-sans text-gray-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          .print-only-container { display: none; }
        }
        @media print {
          /* 1. Hide everything in the body except our print container without triggering CSS unmounts */
          body > *:not(.print-only-container) { 
            height: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
            opacity: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* 2. Show the print container */
          .print-only-container {
            display: block !important;
            background: white !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* 3. Force exact colors for clinical branding */
          .print-color-exact {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          /* 4. Prevent awkward page breaks */
          .page-break-avoid { 
            break-inside: avoid; 
            page-break-inside: avoid; 
          }

          /* 5. Remove the browser's default 4-corner headers/footers */
          @page { 
            margin: 0; 
            size: auto; 
          }

          /* Table spacing magic to prevent overlapping fixed headers */
          table.print-table { width: 100%; border-collapse: collapse; border-spacing: 0; }
          table.print-table > thead { display: table-header-group; }
          table.print-table > tfoot { display: table-footer-group; }
        }
      `}} />
      
      {/* Fixed Print Header - Repeats on every page */}
      <div className="fixed top-0 left-0 w-full px-12 pt-8 pb-4 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl print-color-exact">
            A
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Acme Medical Center</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Clinical Documentation</p>
          </div>
        </div>
      </div>

      {/* Fixed Print Footer - Repeats at the absolute bottom of every page */}
      <div className="fixed bottom-0 left-0 w-full px-12 pb-8 pt-4 bg-white border-t border-gray-200 z-50 flex justify-between items-end">
        <div className="text-xs text-gray-500">
          <p className="font-bold" style={{ color: '#374151' }}>Acme Medical Center</p>
          <p>123 Healthcare Way, Suite 500</p>
          <p>New York, NY 10001</p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>Tel: (555) 123-4567 • info@acme-medical.com</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Content Area - Uses Table spacing hack to prevent overlapping fixed headers */}
      <table className="print-table w-full bg-white">
        <thead>
          <tr>
            {/* Height matches the fixed header (approx 100px) + some top padding */}
            <td><div className="h-[120px] w-full" /></td>
          </tr>
        </thead>
        
        <tbody>
          <tr>
            <td className="px-12">
              <h2 className="text-3xl font-bold capitalize mb-2">{docToRender.type?.replace("-", " ")}</h2>
              <div className="h-1.5 w-16 bg-primary mb-10 print-color-exact" />
              
              <div className="text-sm leading-relaxed space-y-6">
                {docToRender.content ? (
                  <div className="whitespace-pre-wrap">
                    {docToRender.content.split('\n').map((line, i) => {
                      if (line.startsWith('###')) return <h3 key={i} className="text-base font-bold mt-8 mb-3 uppercase tracking-wider">{line.replace('###', '').trim()}</h3>
                      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold mb-2">{line.replace(/\*\*/g, '')}</p>
                      return <p key={i} className="mb-4">{line}</p>
                    })}
                  </div>
                ) : (
                  <p>No content available.</p>
                )}
              </div>

              {/* Signature Section - Controlled by Toggle */}
              {showSignature && (
                <div className="mt-16 flex flex-col items-start page-break-avoid">
                  {isSigned && (
                    <div className="mb-4">
                      <div 
                        className="text-3xl font-serif italic -rotate-2"
                        style={{ color: '#1e3a8a', textDecoration: 'underline', textDecorationColor: '#bfdbfe', textUnderlineOffset: '8px' }}
                      >
                        Alex Care
                      </div>
                      <div 
                        className="text-[10px] mt-2 font-bold uppercase tracking-widest print-color-exact"
                        style={{ color: '#2563eb' }}
                      >
                        Digitally Signed & Verified
                      </div>
                    </div>
                  )}
                  <div className="w-64 pt-4" style={{ borderTop: '2px solid #e5e7eb' }}>
                    <p className="text-base font-bold" style={{ color: '#111827' }}>Dr. Alexander Care</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Medical Practitioner</p>
                  </div>
                </div>
              )}

              {/* Confidential Widget (Print) */}
              <div 
                className="mt-12 mb-8 p-6 rounded-xl page-break-avoid print-color-exact"
                style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#991b1b' }}>Strictly Confidential • PHI Record</p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#b91c1c' }}>
                  This document contains Protected Health Information (PHI) and is intended solely for authorized clinical use. 
                  Unauthorized access, reproduction, or distribution is strictly prohibited and may violate healthcare privacy regulations.
                </p>
              </div>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            {/* Height matches the fixed footer (approx 80px) + some bottom padding */}
            <td><div className="h-[100px] w-full" /></td>
          </tr>
        </tfoot>
      </table>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent
          side="right"
          className="w-full sm:w-[50vw]! sm:max-w-none! p-0 flex flex-col h-full border-l overflow-hidden [&>button]:hidden no-print"
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
                  <ButtonGroup className="gap-0!">
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-green-600 hover:bg-green-700 border border-green-600 text-white cursor-pointer text-xs gap-2 rounded-r-none! z-10"
                      onClick={() => setIsSigned(true)}
                      disabled={!showSignature}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Sign
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline"
                          className="h-7 w-7 p-0 cursor-pointer rounded-l-none! border-l-0! focus-visible:ring-0"
                        >
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Document Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer gap-2"
                          onClick={() => setShowSignature(!showSignature)}
                        >
                          <FileSignature className={cn("h-4 w-4", showSignature ? "text-primary" : "text-muted-foreground")} />
                          <span className="flex-1">Include Signature</span>
                          {showSignature && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ButtonGroup>
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
                <Button variant="outline" size="icon" className="h-7 w-7 cursor-pointer" onClick={handlePrint}>
                  <Printer className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" onClick={closeSheet} className="h-7 w-7 cursor-pointer ml-1">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Document Container Section (Screen View) */}
          <div className="flex-1 min-h-0 bg-gray-100 dark:bg-gray-900 overflow-hidden p-4 md:p-8 flex justify-center">
            <div className={cn(
              "w-full max-w-[1000px] bg-white shadow-sm border rounded-sm flex flex-col h-full",
              isSigned && "ring-1 ring-blue-100"
            )}>
              <div className="shrink-0 py-4 px-8 md:py-5 md:px-10 border-b border-gray-100 flex justify-between items-center">
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

              <ScrollArea className="flex-1 min-h-0">
                <div className="p-8 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">{docToRender.type?.replace("-", " ")}</h2>
                    <div className="h-1 w-12 bg-primary mt-2 rounded-full" />
                  </div>

                  <div className="space-y-6 text-[13px] text-gray-700 leading-relaxed">
                    <div className={cn(
                      "min-h-[500px] outline-none",
                      isSigned && "pointer-events-none opacity-90"
                    )}>
                      {docToRender.content ? (
                        <div className="whitespace-pre-wrap font-sans">
                          {docToRender.content.split('\n').map((line, i) => {
                            if (line.startsWith('###')) return <h3 key={i} className="text-sm font-bold text-gray-900 mt-6 mb-2 uppercase tracking-wider">{line.replace('###', '').trim()}</h3>
                            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-900 mb-1">{line.replace(/\*\*/g, '')}</p>
                            return <p key={i} className="mb-2">{line}</p>
                          })}
                        </div>
                      ) : (
                        <p>Loading document content...</p>
                      )}
                    </div>
                  </div>

                  {/* Signature Section (Screen) - Controlled by Toggle */}
                  {showSignature && (
                    <div className="mt-12 flex flex-col items-start">
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
                  )}

                  {/* Confidential Widget (Screen) */}
                  <div className="mt-12 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50/50 p-4 text-red-800">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider">Strictly Confidential • Medical Record</p>
                      <p className="text-[10px] leading-relaxed text-red-700/80">
                        This document contains Protected Health Information (PHI) and is intended solely for authorized clinical use. 
                        Unauthorized access, reproduction, or distribution is strictly prohibited and may violate healthcare privacy regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="shrink-0 p-8 md:p-10 py-5! border-t border-gray-100 bg-gray-50/30">
                <div className="text-[10px] text-muted-foreground leading-relaxed flex justify-between items-end">
                  <div>
                    <p className="font-semibold text-gray-600">Acme Medical Center</p>
                    <p>123 Healthcare Way, Suite 500</p>
                    <p>New York, NY 10001</p>
                  </div>
                  <div className="text-right">
                    <p>Tel: (555) 123-4567 • info@acme-medical.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section - Always visible */}
          <div className="h-14 border-t flex items-center justify-end px-4 gap-2 bg-background shrink-0">
            <Button variant="outline" className="cursor-pointer" onClick={closeSheet}>
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Print Document Portal */}
      {printDocument}
    </>
  )
}

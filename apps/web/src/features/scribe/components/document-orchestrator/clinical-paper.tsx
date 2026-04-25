import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@workspace/ui/lib/utils"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

interface ClinicalPaperProps {
  document: {
    title?: string
    type?: string
    content?: string
  }
  isSigned?: boolean
  showSignature?: boolean
  doctorName?: string
  clinicName?: string
  onPrint?: () => void
}

export function ClinicalPaper({ 
  document: doc, 
  isSigned, 
  showSignature = true,
  doctorName = "Dr. Alexander Care",
  clinicName = "Acme Medical Center"
}: ClinicalPaperProps) {
  
  const printPortal = typeof document !== 'undefined' ? createPortal(
    <div className="print-only-container font-sans text-gray-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen { .print-only-container { display: none; } }
        @media print {
          body > *:not(.print-only-container) { height: 0 !important; overflow: hidden !important; visibility: hidden !important; opacity: 0 !important; }
          .print-only-container { display: block !important; background: white !important; position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; }
          .print-color-exact { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
          @page { margin: 0; size: auto; }
          table.print-table { width: 100%; border-collapse: collapse; }
          table.print-table > thead { display: table-header-group; }
          table.print-table > tfoot { display: table-footer-group; }
        }
      `}} />
      
      <div className="fixed top-0 left-0 w-full px-12 pt-8 pb-4 bg-white border-b z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold print-color-exact">A</div>
          <div>
            <h1 className="font-bold text-base leading-tight">{clinicName}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Clinical Documentation</p>
          </div>
        </div>
      </div>

      {/* Fixed Print Footer - Repeats at the absolute bottom of every page */}
      <div className="fixed bottom-0 left-0 w-full px-12 pb-8 pt-4 bg-white border-t border-gray-200 z-50 flex justify-between items-end">
        <div className="text-[10px] text-gray-500">
          <p className="font-bold" style={{ color: '#374151' }}>{clinicName}</p>
          <p>123 Healthcare Way, Suite 500</p>
          <p>New York, NY 10001</p>
        </div>
        <div className="text-right text-[10px] text-gray-400">
          <p>PHI Confidential Record</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <table className="print-table w-full bg-white">
        <thead><tr><td><div className="h-[120px]" /></td></tr></thead>
        <tbody>
          <tr>
            <td className="px-12">
              <h2 className="text-2xl font-bold capitalize mb-2">{doc.type?.replace("-", " ")}</h2>
              <div className="h-1 w-12 bg-primary mb-8 print-color-exact" />
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {doc.content || "No content available."}
              </div>
              
              {showSignature && (
                <div className="mt-12 flex flex-col items-start">
                  {isSigned && (
                    <div className="mb-2">
                      <div className="text-2xl font-serif italic text-blue-900">- {doctorName}</div>
                      <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest print-color-exact">Digitally Verified</div>
                    </div>
                  )}
                  <div className="w-48 pt-2 border-t border-gray-200">
                    <p className="text-sm font-bold">{doctorName}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Medical Practitioner</p>
                  </div>
                </div>
              )}
            </td>
          </tr>
        </tbody>
        <tfoot><tr><td><div className="h-[100px]" /></td></tr></tfoot>
      </table>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className={cn(
        "w-full max-w-[850px] bg-white shadow-sm border rounded-sm flex flex-col h-full",
        isSigned && "ring-1 ring-blue-100"
      )}>
        {/* Screen Header - Fixed */}
        <div className="shrink-0 py-4 px-8 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
            <div>
              <h1 className="font-bold text-sm leading-tight text-gray-900">{clinicName}</h1>
              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">Clinical Documentation</p>
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <ScrollArea className="flex-1 min-h-0 bg-white">
          <div className="p-8 md:p-10">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 capitalize tracking-tight">{doc.type?.replace("-", " ")}</h2>
              <div className="h-1 w-10 bg-primary mt-1.5 rounded-full" />
            </div>

            <div className="text-[13px] text-gray-700 leading-relaxed min-h-[300px]">
                {doc.content ? (
                  <div className="whitespace-pre-wrap font-sans">
                    {doc.content}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Generating content...</p>
                )}
            </div>

            {showSignature && (
              <div className="mt-10 flex flex-col items-start">
                {isSigned && (
                  <div className="mb-2 animate-in fade-in slide-in-from-bottom-1 duration-500">
                    <div className="font-heading text-xl text-blue-900/80 italic tracking-tight underline decoration-blue-200 underline-offset-4">
                      {doctorName}
                    </div>
                    <div className="text-[8px] text-blue-600/50 mt-0.5 font-semibold uppercase tracking-widest">Digital Verification</div>
                  </div>
                )}
                <div className="w-40 border-t border-gray-200 pt-2">
                  <p className="text-xs font-bold text-gray-900">{doctorName}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Medical Practitioner</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Screen Footer - Fixed */}
        <div className="shrink-0 p-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <div className="text-[9px] text-muted-foreground leading-relaxed flex justify-between items-end">
            <div>
              <p className="font-semibold text-gray-600">{clinicName}</p>
              <p>123 Healthcare Way, Suite 500, New York, NY 10001</p>
            </div>
            <div className="text-right">
              <p>PHI Confidential Record</p>
            </div>
          </div>
        </div>
      </div>
      {printPortal}
    </>
  )
}

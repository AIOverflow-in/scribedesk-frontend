import { createPortal } from "react-dom"
import { cn } from "@workspace/ui/lib/utils"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { ClinicalLexicalEditor } from "@/shared/components/clinical-editor"

interface ClinicalPaperProps {
  document: {
    title?: string
    type?: string
    content?: string
  }
  isSigned?: boolean
  showSignature?: boolean
  clinicName?: string
  onPrint?: () => void
  onContentChange?: (content: string) => void
  onTextChange?: (text: string) => void
  onHtmlChange?: (html: string) => void
  currentHtml?: string
}

export function ClinicalPaper({ 
  document: doc, 
  isSigned, 
  showSignature = true,
  clinicName = "Norwich Hospital",
  onContentChange,
  onTextChange,
  onHtmlChange,
  currentHtml
}: ClinicalPaperProps) {
  
  void showSignature; // kept for future signing feature
  
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
          .lexical-print-content h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
          .lexical-print-content h2 { font-size: 20px; font-weight: bold; margin-bottom: 12px; }
          .lexical-print-content h3 { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
          .lexical-print-content p { margin-bottom: 12px; line-height: 1.6; }
          .lexical-print-content ul { list-style-type: disc; margin-left: 24px; margin-bottom: 12px; }
          .lexical-print-content ol { list-style-type: decimal; margin-left: 24px; margin-bottom: 12px; }
          .lexical-print-content li { margin-bottom: 4px; }
          .lexical-print-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 16px; font-style: italic; margin-bottom: 12px; }
          .lexical-print-content table { width: 100%; border-collapse: collapse; margin-bottom: 16px; border: 1px solid #e5e7eb; }
          .lexical-print-content th { background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 12px; }
          .lexical-print-content td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 12px; }
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
          <p>Colney Lane, Norwich</p>
          <p>NR4 7UY, United Kingdom</p>
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
              <div 
                className="text-sm leading-relaxed font-sans lexical-print-content"
                dangerouslySetInnerHTML={{ __html: currentHtml || "" }}
              />
              
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
        "w-full bg-white shadow-sm border rounded-sm flex flex-col h-full",
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
          <div className="flex flex-col min-h-full">
            <div className="text-[15px] text-gray-700 leading-relaxed flex-1 flex flex-col">
                {doc.content ? (
                  <ClinicalLexicalEditor 
                    initialContent={doc.content} 
                    onChange={onContentChange}
                    onTextChange={onTextChange}
                    onHtmlChange={onHtmlChange}
                    readOnly={isSigned} 
                  />
                ) : (
                  <div className="p-8 md:p-10">
                    <p className="text-muted-foreground italic">Generating content...</p>
                  </div>
                )}
            </div>
          </div>
        </ScrollArea>

        {/* Screen Footer - Fixed */}
        <div className="shrink-0 p-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <div className="text-[9px] text-muted-foreground leading-relaxed flex justify-between items-end">
            <div>
              <p className="font-semibold text-gray-600">{clinicName}</p>
              <p>Colney Lane, Norwich, NR4 7UY, United Kingdom</p>
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

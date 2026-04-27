import { Calendar, User, ExternalLink, PillBottle, Copy, CircleCheck } from "lucide-react"
import * as React from "react"
import ReactMarkdown from "react-markdown"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import type { Consultation } from "@workspace/features/scribe/types"
import { cn } from "@workspace/ui/lib/utils"

interface HistoryDetailModalProps {
  consultation: Consultation | null
  currentSessionId?: string
  onClose: () => void
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, '') 
    .replace(/\*\*(.*?)\*\*/g, '$1') 
    .replace(/\*(.*?)\*/g, '$1') 
    .replace(/^\s*-\s+/gm, '• ') 
    .trim()
}

export function HistoryDetailModal({ consultation, currentSessionId, onClose }: HistoryDetailModalProps) {
  const [isCopied, setIsCopied] = React.useState(false)
  
  if (!consultation) return null

  const isCurrent = consultation.id === currentSessionId
  const summaryContent = consultation.summary || ""

  const handleCopy = async () => {
    try {
      const cleanText = stripMarkdown(summaryContent)
      await navigator.clipboard.writeText(cleanText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Dialog open={!!consultation} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[750px] max-h-[85vh] flex flex-col p-0 overflow-hidden [&>button]:cursor-pointer">
        {/* Modal Header */}
        <DialogHeader className="p-6 pb-4 shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(consultation.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center justify-between text-foreground">
            {consultation.title}
            {isCurrent && (
              <Badge className="bg-amber-500 border-none text-[10px] h-5 px-1.5 font-black uppercase">Current</Badge>
            )}
          </DialogTitle>
          
          {/* Simple Patient Details */}
          <div className="flex items-center gap-2 mt-2 text-sm">
             <User className="h-4 w-4 text-muted-foreground/60" />
             <span className="font-medium text-foreground">{consultation.patient.name}</span>
             <span className="text-muted-foreground/40 px-1">•</span>
             <span className="text-muted-foreground font-medium">{consultation.patient.age} Years, {consultation.patient.gender.charAt(0).toUpperCase() + consultation.patient.gender.slice(1)}</span>
          </div>
        </DialogHeader>

        {/* Tab System */}
        <Tabs defaultValue="summary" className="flex flex-col flex-1 min-h-0">
          <div className="px-6 pt-1 pb-3 shrink-0">
            <TabsList className="h-9">
              <TabsTrigger value="summary" className="cursor-pointer">
                Summary
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="cursor-pointer">
                Prescriptions
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-0 px-6 pb-2 flex flex-col">
            <TabsContent value="summary" className="flex-1 min-h-0 m-0 data-[state=active]:flex flex-col focus-visible:outline-none relative group/summary">
              {summaryContent ? (
                <>
                  {/* Contextual Copy Button - Persistent inside Summary tab */}
                  <div className="absolute top-3 right-3 z-20">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-200 shadow-xs bg-background/80 backdrop-blur-xs opacity-0 group-hover/summary:opacity-100"
                      onClick={handleCopy}
                    >
                      <div className="relative h-4 w-4">
                        <Copy className={cn(
                          "absolute inset-0 h-4 w-4 transition-all duration-300 transform",
                          isCopied ? "opacity-0 scale-75 rotate-45" : "opacity-100 scale-100 rotate-0"
                        )} />
                        <CircleCheck className={cn(
                          "absolute inset-0 h-4 w-4 text-green-600 transition-all duration-300 transform",
                          isCopied ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-45"
                        )} />
                      </div>
                    </Button>
                  </div>

                  <NativeScroll className="flex-1 min-h-0 bg-background border rounded-lg shadow-xs">
                    <div className="p-6 md:p-8 pt-4">
                      <div className="text-[14px] leading-relaxed text-foreground/90">
                        <ReactMarkdown
                          components={{
                            h3: ({node, ...props}) => <h3 className="text-[13px] font-bold text-foreground mt-4 mb-2 uppercase tracking-wide" {...props} />,
                            p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-3 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            strong: ({node, ...props}) => <span className="font-bold text-foreground" {...props} />,
                          }}
                        >
                          {summaryContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </NativeScroll>
                </>
              ) : (
                <Empty className="flex-1 min-h-0 py-12 bg-transparent border border-dashed rounded-xl flex items-center justify-center">
                  <EmptyHeader>
                    <EmptyTitle>No Summary Available</EmptyTitle>
                    <EmptyDescription>This consultation doesn't have a generated summary.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </TabsContent>

            <TabsContent value="prescriptions" className="flex-1 min-h-0 m-0 data-[state=active]:flex flex-col focus-visible:outline-none">
              <Empty className="flex-1 min-h-0 py-12 bg-transparent border border-dashed rounded-xl flex items-center justify-center">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="bg-primary/10 text-primary">
                    <PillBottle className="h-4 w-4" />
                  </EmptyMedia>
                  <EmptyTitle>No Prescriptions</EmptyTitle>
                  <EmptyDescription>No medications were prescribed during this session.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TabsContent>
          </div>
        </Tabs>

        {/* Fixed Footer Actions */}
        <div className="p-4 flex justify-end gap-2 shrink-0 bg-muted/5">
          <Button variant="outline" size="sm" onClick={onClose} className="h-9 px-4 cursor-pointer text-xs font-semibold">
            Close
          </Button>
          <Button size="sm" className="gap-2 h-9 px-4 cursor-pointer shadow-sm text-xs font-semibold" onClick={() => {
            window.open(`/scribe?id=${consultation.id}`, '_blank')
            onClose()
          }}>
            <ExternalLink className="h-3.5 w-3.5" /> Open Full Workspace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

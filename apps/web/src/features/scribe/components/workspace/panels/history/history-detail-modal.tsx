import { Calendar, User, ExternalLink, PillBottle } from "lucide-react"
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

interface HistoryDetailModalProps {
  consultation: Consultation | null
  currentSessionId?: string
  onClose: () => void
}

export function HistoryDetailModal({ consultation, currentSessionId, onClose }: HistoryDetailModalProps) {
  if (!consultation) return null

  const isCurrent = consultation.id === currentSessionId

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
            <TabsContent value="summary" className="flex-1 min-h-0 m-0 data-[state=active]:flex flex-col focus-visible:outline-none">
              {consultation.summary ? (
                <NativeScroll className="flex-1 min-h-0 bg-background border rounded-lg shadow-xs">
                  <div className="p-4 text-[14px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
                    {consultation.summary}
                  </div>
                </NativeScroll>
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
        <div className="p-4 flex justify-end gap-2 shrink-0">
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

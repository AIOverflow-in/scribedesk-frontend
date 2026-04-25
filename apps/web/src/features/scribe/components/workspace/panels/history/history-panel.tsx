import * as React from "react"
import { Layers, Calendar, ChevronRight } from "lucide-react"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Badge } from "@workspace/ui/components/badge"
import { mockConsultations } from "../../../../data/mock-consultations"
import type { Consultation } from "@workspace/features/scribe/types"
import { cn } from "@workspace/ui/lib/utils"
import { HistoryDetailModal } from "./history-detail-modal"

export interface HistoryPanelProps {
  consultation: Consultation
}

export function HistoryPanel({ consultation }: HistoryPanelProps) {
  const [selectedHistoryId, setSelectedHistoryId] = React.useState<string | null>(null)
  
  const patientHistory = mockConsultations
    .filter(c => c.patient.id === consultation.patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const selectedConsultation = mockConsultations.find(c => c.id === selectedHistoryId) || null

  return (
    <div className="h-full flex flex-col bg-background rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-muted/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-foreground/80 tracking-tight">Patient Longitudinal Record</h3>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">{patientHistory.length} Sessions</span>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 md:p-10 relative min-h-full">
          {/* 1. Center Timeline Line */}
          <div className="absolute top-0 bottom-0 w-px bg-border left-8 md:left-1/2 md:-translate-x-1/2" />

          <div className="relative space-y-0">
            {patientHistory.map((item, index) => {
              const isEven = index % 2 === 0
              const isCurrent = item.id === consultation.id

              return (
                <div key={item.id} className="relative grid grid-cols-1 md:grid-cols-2 items-center min-h-[140px]">
                  {/* 2. Timeline Dot */}
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 z-20 rounded-full border-2 transition-all duration-300 bg-background",
                    "left-8 md:left-1/2 -translate-x-1/2",
                    isCurrent ? "w-4 h-4 border-amber-500 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]" : "w-3 h-3 border-border group-hover:border-primary"
                  )} />
                  
                  {/* 3. Horizontal Connector Line */}
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-px bg-border z-10",
                    "left-8 w-6 md:w-8", // Brought closer to tree
                    isEven ? "md:left-auto md:right-1/2" : "md:left-1/2 md:right-auto" 
                  )} />

                  {/* 4. The Date (Opposite side of card - Closer to tree) */}
                  <div className={cn(
                    "hidden md:flex absolute top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/80 tracking-tight items-center gap-2",
                    isEven ? "left-1/2 ml-8" : "right-1/2 mr-8" // Same offset as cards
                  )}>
                    {!isEven && <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                    <Calendar className="h-3 w-3" />
                    {isEven && <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                  </div>

                  {/* 5. The Branching Card */}
                  <div className={cn(
                    "col-span-1 flex py-4",
                    "pl-14 pr-2 md:px-0", 
                    isEven ? "md:col-start-1 md:justify-end md:pr-8" : "md:col-start-2 md:justify-start md:pl-8" 
                  )}>
                    <div 
                      className={cn(
                        "group border rounded-xl p-4 transition-all hover:shadow-md cursor-pointer bg-card relative w-full max-w-[380px] text-left",
                        isCurrent ? "border-amber-500/40 bg-amber-50/5 ring-1 ring-amber-500/10 shadow-sm" : "hover:border-primary/40 shadow-xs"
                      )}
                      onClick={() => setSelectedHistoryId(item.id)}
                    >
                      {isCurrent && (
                        <div className="absolute -top-2.5 left-4">
                           <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-[10px] font-bold h-4.5 px-2 tracking-normal shadow-xs">Current</Badge>
                        </div>
                      )}

                      {/* Line 1: Title - Scaled Font */}
                      <h4 className="text-base font-bold text-foreground leading-tight mb-2">
                        {item.title}
                      </h4>
                      
                      {/* Mobile Date Only */}
                      <div className="md:hidden flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-2">
                         <Calendar className="h-3 w-3" />
                         {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>

                      {/* Line 2: Description - Scaled Font */}
                      <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-3 flex justify-end items-center gap-1 text-primary group-hover:text-primary/80 transition-colors">
                         <span className="text-[11px] font-bold tracking-tight">
                           Open Summary
                         </span>
                         <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="h-20 w-full" />
          </div>
        </div>
      </ScrollArea>

      <HistoryDetailModal 
        consultation={selectedConsultation} 
        currentSessionId={consultation.id}
        onClose={() => setSelectedHistoryId(null)}
      />
    </div>
  )
}

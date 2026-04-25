import { useState } from "react"
import { AudioLines, PenLine, Library, Layers } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { TranscriptPanel } from "./panels/transcript/transcript-panel"
import { SummaryPanel } from "./panels/summary/summary-panel"
import { ReportsPanel } from "./panels/reports/reports-panel"
import { HistoryPanel } from "./panels/history/history-panel"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ScribeDetailTabsProps {
  consultation: Consultation
}

export function ScribeDetailTabs({ consultation }: ScribeDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("transcript")

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full h-full flex flex-col"
    >
      <TabsList className="shrink-0 bg-transparent gap-1 h-auto p-0 justify-start">
        <TabsTrigger 
          value="transcript" 
          className="group rounded-md px-3 py-1.5 h-8 cursor-pointer border border-transparent hover:border-border/50 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border transition-all gap-2"
        >
          <AudioLines className="h-3.5 w-3.5 text-muted-foreground/70 transition-colors group-hover:text-red-500 group-data-[state=active]:text-red-500" />
          Transcript
        </TabsTrigger>
        
        <div className="h-4 w-px bg-border/60 self-center mx-0.5" />
        
        <TabsTrigger 
          value="summary" 
          className="group rounded-md px-3 py-1.5 h-8 cursor-pointer border border-transparent hover:border-border/50 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border transition-all gap-2"
        >
          <PenLine className="h-3.5 w-3.5 text-muted-foreground/70 transition-colors group-hover:text-blue-500 group-data-[state=active]:text-blue-500" />
          Summary
        </TabsTrigger>

        <div className="h-4 w-px bg-border/60 self-center mx-0.5" />

        <TabsTrigger 
          value="reports" 
          className="group rounded-md px-3 py-1.5 h-8 cursor-pointer border border-transparent hover:border-border/50 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border transition-all gap-2"
        >
          <Library className="h-3.5 w-3.5 text-muted-foreground/70 transition-colors group-hover:text-green-500 group-data-[state=active]:text-green-500" />
          Reports
        </TabsTrigger>

        <div className="h-4 w-px bg-border/60 self-center mx-0.5" />

        <TabsTrigger 
          value="history" 
          className="group rounded-md px-3 py-1.5 h-8 cursor-pointer border border-transparent hover:border-border/50 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border transition-all gap-2"
        >
          <Layers className="h-3.5 w-3.5 text-muted-foreground/70 transition-colors group-hover:text-amber-500 group-data-[state=active]:text-amber-500" />
          History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="transcript" className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden">
        <TranscriptPanel consultation={consultation} />
      </TabsContent>

      <TabsContent value="summary" className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden">
        <SummaryPanel consultation={consultation} />
      </TabsContent>

      <TabsContent value="reports" className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden">
        <ReportsPanel consultation={consultation} />
      </TabsContent>

      <TabsContent value="history" className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden">
        <HistoryPanel consultation={consultation} />
      </TabsContent>
    </Tabs>
  )
}

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { TranscriptPanel } from "./transcript-panel"
import { SummaryPanel } from "./summary-panel"
import { ReportsPanel } from "./reports-panel"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ScribeDetailTabsProps {
  consultation: Consultation
}

export function ScribeDetailTabs({ consultation }: ScribeDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("transcript")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="transcript">Transcript</TabsTrigger>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="transcript" className="mt-4">
        <TranscriptPanel consultation={consultation} />
      </TabsContent>

      <TabsContent value="summary" className="mt-4">
        <SummaryPanel consultation={consultation} />
      </TabsContent>

      <TabsContent value="reports" className="mt-4">
        <ReportsPanel consultation={consultation} />
      </TabsContent>
    </Tabs>
  )
}

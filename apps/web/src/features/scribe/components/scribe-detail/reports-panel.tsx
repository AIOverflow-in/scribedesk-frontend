import { cn } from "@workspace/ui/lib/utils"
import { Library, FileText, Download, Eye } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ReportsPanelProps {
  consultation: Consultation
}

export function ReportsPanel({ consultation }: ReportsPanelProps) {
  const reports = consultation.reports ?? []

  return (
    <div className={cn(
      "h-full flex flex-col overflow-hidden",
      reports.length === 0 && "border rounded-lg bg-background"
    )}>
      {reports.length === 0 ? (
        <div className="flex items-center justify-center flex-1 p-8">
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-green-500/10 text-green-500">
                <Library />
              </EmptyMedia>
              <EmptyTitle>No Reports Generated</EmptyTitle>
              <EmptyDescription>
                Once clinical reports are created for this session, you'll be able to view and download them here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-3 px-1 pr-4 pt-1">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{report.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {report.type} • {new Date(report.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

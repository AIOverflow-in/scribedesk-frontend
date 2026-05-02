import { useState, useEffect } from "react"
import { Library, FileText, Eye, Trash2 } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { useScribe } from "../../../../context/scribe-context"
import { useReport, useDeleteReport } from "../../../../hooks/use-scribe-reports"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ReportsPanelProps {
  consultation: Consultation
}

export function ReportsPanel({ consultation }: ReportsPanelProps) {
  const { openSheet } = useScribe()
  const [viewingReportId, setViewingReportId] = useState<string | null>(null)
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null)
  const { data: report } = useReport(viewingReportId ?? "")
  const deleteReport = useDeleteReport()

  const reports = consultation.reports ?? []

  useEffect(() => {
    if (report) {
      openSheet({
        id: report.id,
        title: report.title,
        type: report.title,
        createdAt: report.created_at,
        content: report.content,
      })
      setViewingReportId(null)
    }
  }, [report, openSheet])

  return (
    <>
      <div className={`h-full flex flex-col overflow-hidden ${reports.length === 0 ? "border rounded-lg bg-background" : ""}`}>
        {reports.length === 0 ? (
          <div className="flex items-center justify-center flex-1 p-8">
            <Empty className="border-none">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-green-500/10 text-green-500">
                  <Library />
                </EmptyMedia>
                <EmptyTitle>No Reports Generated</EmptyTitle>
                <EmptyDescription>
                  Click "Create" in the header to generate a clinical report from this session.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-3 px-1 pr-4 pt-1">
            {reports.map((r: any) => (
              <Card key={r.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{r.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {r.type ?? r.template_name} • {new Date(r.created_at ?? r.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => {
                          openSheet({ id: r.id, title: r.title, type: r.template_name, createdAt: r.created_at })
                          setViewingReportId(r.id)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive cursor-pointer"
                        onClick={() => setDeletingReportId(r.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
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

      <AlertDialog open={!!deletingReportId} onOpenChange={(o) => !o && setDeletingReportId(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this report. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deletingReportId) {
                  deleteReport.mutate(deletingReportId)
                  setDeletingReportId(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

import * as React from "react"
import { AudioLines } from "lucide-react"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from "@workspace/ui/components/empty"
import { useScribeStore } from "../../../../stores/scribe-store"
import { useScribeTimeline } from "../../../../hooks/use-scribe-sessions"
import { TranscriptPanelSkeleton } from "./transcript-panel-skeleton"
import type { Consultation } from "@workspace/features/scribe/types"

export interface TranscriptPanelProps {
  consultation: Consultation
}

function formatTime(seconds?: number | null) {
  if (seconds == null) return ""
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function formatEventDate(iso: string) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  return `${time}, ${date}`
}

export function TranscriptPanel({ consultation }: TranscriptPanelProps) {
  const liveChunks = useScribeStore((s: any) => s.liveChunks)
  const currentPartial = useScribeStore((s: any) => s.currentPartial)
  const isRecording = useScribeStore((s: any) => s.isRecording)
  const { data: timeline, isLoading } = useScribeTimeline(consultation.id)

  // Merge events and transcripts, sort chronologically by relative_seconds then created_at
  const sortedEntries = React.useMemo(() => {
    if (!timeline) return []
    return [...timeline].sort((a: any, b: any) => {
      const aSec = a.relative_seconds ?? 0
      const bSec = b.relative_seconds ?? 0
      if (aSec !== bSec) return aSec - bSec
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })
  }, [timeline])

  const hasContent = sortedEntries.length > 0 || liveChunks.length > 0 || currentPartial

  return (
    <div className="border rounded-lg bg-background h-full flex flex-col overflow-hidden">
      {isLoading ? (
        <TranscriptPanelSkeleton />
      ) : hasContent ? (
        <NativeScroll className="flex-1">
          <div className="p-4 md:p-6 space-y-4">
            {/* Sorted timeline entries (events + transcripts merged) */}
            {sortedEntries.map((entry: any) => (
              entry.type === "event" ? (
                <div key={entry.id}>
                  <div className="text-xs text-muted-foreground">
                    {entry.event_type === "started" ? "Transcript started at" : entry.event_type === "resumed" ? "Transcript resumed at" : "Transcript stopped at"}{" "}
                    {formatEventDate(entry.created_at)}
                  </div>
                  {entry.event_type === "stopped" && <div className="border-t mt-3" />}
                </div>
              ) : (
                <div key={entry.id} className="group">
                  <div className="text-xs font-medium text-foreground/60 mb-1 tabular-nums">
                    {formatTime(entry.relative_seconds)}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              )
            ))}

            {/* Live transcript chunks */}
            {liveChunks.map((chunk: any, i: number) => (
              <div key={`live-${i}`} className="group">
                <div className="text-xs font-medium text-foreground/60 mb-1 tabular-nums">
                  {formatTime(chunk.timestamp)}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {chunk.text}
                </p>
              </div>
            ))}

            {/* Current partial / recording indicator */}
            {currentPartial && (
              <div className="group border-l-2 border-red-400 pl-3">
                <div className="text-xs font-medium text-red-500/80 mb-1 tabular-nums">
                  LIVE
                </div>
                <div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {currentPartial}
                  </p>
                  {isRecording && (
                    <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-red-500 font-medium">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      Recording...
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </NativeScroll>
      ) : (
        <div className="flex items-center justify-center flex-1 p-8">
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-red-500/10 text-red-500">
                <AudioLines />
              </EmptyMedia>
              <EmptyTitle>No Transcript Available</EmptyTitle>
              <EmptyDescription>
                {isRecording
                  ? "Waiting for speech..."
                  : "Start recording to see the live transcript."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  )
}

import * as React from "react"
import { AudioLines } from "lucide-react"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import { ThreeDotsScale } from "@/shared/components/spinners"
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
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const userScrolledAway = React.useRef(false)
  const prevIsFetchingRef = React.useRef(false)

  const liveChunks = useScribeStore((s: any) => s.liveChunks)
  const pendingChunks = useScribeStore((s: any) => s.pendingChunks)
  const currentPartial = useScribeStore((s: any) => s.currentPartial)
  const isRecording = useScribeStore((s: any) => s.isRecording)
  const isSaving = useScribeStore((s: any) => s.isSaving)
  const { data: timeline, isLoading, isFetching } = useScribeTimeline(consultation.id)

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

  const hasContent = sortedEntries.length > 0 || liveChunks.length > 0 || pendingChunks || currentPartial

  // Clear ephemeral store chunks once backend timeline has refreshed after a save
  React.useEffect(() => {
    if (prevIsFetchingRef.current && !isFetching && !isSaving && timeline) {
      useScribeStore.setState({ liveChunks: [], pendingChunks: "", currentPartial: "" })
    }
    prevIsFetchingRef.current = isFetching
  }, [isFetching, isSaving, timeline])

  // Auto-scroll to bottom during recording
  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
    userScrolledAway.current = !atBottom
  }, [])

  React.useEffect(() => {
    if (isRecording && !userScrolledAway.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      })
    }
  }, [isRecording, liveChunks, pendingChunks, currentPartial])

  return (
    <div className="border rounded-lg bg-background h-full flex flex-col overflow-hidden">
      <NativeScroll ref={scrollRef} className="flex-1" onScroll={handleScroll}>
        {isLoading ? (
          <div className="p-6">
            <TranscriptPanelSkeleton />
          </div>
        ) : hasContent || isRecording ? (
          <div className="relative p-4 md:p-6 space-y-4 max-w-[120ch]">
            {sortedEntries.map((entry: any) => (
              entry.type === "event" ? (
                <div key={entry.id}>
                  <div className="text-sm text-muted-foreground">
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
                  <p className="text-base text-foreground/80 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              )
            ))}

            {liveChunks.map((chunk: any, i: number) => (
              <div key={`live-${i}`} className="group">
                <div className="text-xs font-medium text-foreground/60 mb-1 tabular-nums">
                  {formatTime(chunk.timestamp)}
                </div>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {chunk.text}
                </p>
              </div>
            ))}

            {pendingChunks && (
              <div className="group">
                <p className="text-base text-muted-foreground/60 leading-relaxed italic">
                  {pendingChunks.trim()}
                </p>
              </div>
            )}

            {currentPartial && (
              <div className="group border-l-2 border-red-400 pl-3">
                <div className="text-xs font-medium text-red-500/80 mb-1 tabular-nums">
                  LIVE
                </div>
                <div>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    {currentPartial}
                  </p>
                </div>
              </div>
            )}

            {isRecording && (
              <div className="flex items-center gap-2">
                <ThreeDotsScale size={16} className="text-red-500" />
                <span className="text-xs text-muted-foreground">Listening...</span>
              </div>
            )}
          </div>
        ) : isSaving || isFetching ? (
          <div className="p-6">
            <TranscriptPanelSkeleton />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-full p-8">
            <Empty className="border-none">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-red-500/10 text-red-500">
                  <AudioLines />
                </EmptyMedia>
                <EmptyTitle>No Transcript Available</EmptyTitle>
                <EmptyDescription>
                  Start recording to see the live transcript.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </NativeScroll>
    </div>
  )
}

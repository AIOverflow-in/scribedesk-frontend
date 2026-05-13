export function LiveTranscript() {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          <span className="text-xs font-medium tracking-wide text-white/60 uppercase">
            Live Transcription
          </span>
        </div>
        <span className="text-xs tabular-nums text-white/40">12:47</span>
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-white/80">
        <p>
          <span className="text-white/40">[Dr. Sarah]</span> Good morning, Mrs. Johnson. How are
          you feeling today?
        </p>
        <p>
          <span className="text-white/40">[Patient]</span> Not great, doctor. I&apos;ve been having
          these sharp chest pains for the past three days.
        </p>
        <p>
          <span className="text-white/40">[Dr. Sarah]</span> On a scale of 1 to 10, how would you
          rate the pain?
        </p>
        <p>
          <span className="text-white/40">[Patient]</span> About a 7. It gets worse when I take deep
          breaths.
        </p>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="h-1 w-1 animate-pulse rounded-full bg-white/40" />
          <span
            className="h-1 w-1 animate-pulse rounded-full bg-white/40"
            style={{ animationDelay: "300ms" }}
          />
          <span
            className="h-1 w-1 animate-pulse rounded-full bg-white/40"
            style={{ animationDelay: "600ms" }}
          />
          <span className="text-xs text-white/40">Listening...</span>
        </div>
      </div>
    </div>
  )
}

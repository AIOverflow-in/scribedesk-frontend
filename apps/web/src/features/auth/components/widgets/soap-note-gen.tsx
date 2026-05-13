"use client"

import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

export function SoapNoteGen() {
  const [generated, setGenerated] = useState(false)

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-white/60 uppercase">
          SOAP Note Generation
        </span>
        <span className="text-xs tabular-nums text-white/40">12:48</span>
      </div>

      {!generated ? (
        <div className="space-y-3">
          <div className="space-y-1.5 text-sm text-white/80">
            <p>Encounter: Mrs. Johnson, 58yo, chest pain x3 days</p>
            <p className="text-xs text-white/40">Subjective, Objective, Assessment, Plan</p>
          </div>
          <button
            type="button"
            onClick={() => setGenerated(true)}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all",
              "bg-white/10 hover:bg-white/20 active:scale-[0.98]",
            )}
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
            Generate SOAP Note
          </button>
        </div>
      ) : (
        <div className="space-y-2 text-sm leading-relaxed text-white/80">
          <div
            className="rounded-lg border border-white/10 bg-white/5 p-3"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <svg className="size-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium text-emerald-400">SOAP Note Generated</span>
            </div>
            <div className="space-y-1.5">
              <p>
                <span className="text-white/40">S:</span> 58yo F c/o sharp substernal chest pain x3
                days, 7/10, worse with deep inspiration.
              </p>
              <p>
                <span className="text-white/40">O:</span> VS: BP 138/86, HR 92, RR 18, O2 97% RA.
                ECG: NSR, no ST changes.
              </p>
              <p>
                <span className="text-white/40">A:</span> Atypical chest pain, r/o pericarditis vs
                MSK.
              </p>
              <p>
                <span className="text-white/40">P:</span> Obtain CXR, CRP, ESR. Start ibuprofen 600mg
                TID. F/U in 1 week.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGenerated(false)}
            className="w-full rounded-lg px-3 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/60"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

import * as React from "react"
import { Sparkles, Maximize2 } from "lucide-react"
import { useScribe } from "../../context/scribe-context"
import { cn } from "@workspace/ui/lib/utils"

export function AssistantLauncher() {
  const { toggleSidecar, isSidecarOpen, createNewChat } = useScribe()
  const [isHovered, setIsHovered] = React.useState(false)
  const [showSuggestion, setShowSuggestion] = React.useState(false)
  const [currentSuggestion, setCurrentSuggestion] = React.useState(0)

  const suggestions = [
    "Check past medical history?",
    "Summarize red flags for this patient?",
    "Generate treatment recommendations?",
    "Draft a referral letter?"
  ]

  // Periodically show suggestions if the sidecar is closed
  React.useEffect(() => {
    if (isSidecarOpen) {
      setShowSuggestion(false)
      return
    }

    const interval = setInterval(() => {
      setCurrentSuggestion(prev => (prev + 1) % suggestions.length)
      setShowSuggestion(true)
      setTimeout(() => setShowSuggestion(false), 5000) // Show for 5s
    }, 15000) // Every 15s

    return () => clearInterval(interval)
  }, [isSidecarOpen, suggestions.length])

  if (isSidecarOpen) return null

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Suggestion Chip */}
      {(showSuggestion || isHovered) && (
        <div 
          className={cn(
            "bg-white dark:bg-slate-900 border shadow-lg rounded-full py-2 px-4 animate-in fade-in slide-in-from-right-4 duration-300 cursor-pointer hover:border-primary/50 transition-colors",
            "text-xs font-semibold text-foreground flex items-center gap-2"
          )}
          onClick={() => toggleSidecar('chat')}
        >
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          {suggestions[currentSuggestion]}
        </div>
      )}

      {/* Main Launcher Circle */}
      <button
        onClick={() => toggleSidecar('chat')}
        className={cn(
          "w-12 h-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden cursor-pointer",
          isHovered && "ring-4 ring-primary/20"
        )}
      >
        <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className={cn("h-5 w-5", isHovered ? "animate-spin-slow" : "")} />
        
        {/* Quick Actions Overlay (Hover) */}
        {isHovered && (
          <div className="absolute inset-0 bg-primary flex items-center justify-center animate-in zoom-in-75 duration-200">
             <Maximize2 className="h-5 w-5" />
          </div>
        )}
      </button>
    </div>
  )
}

import { MessageSquare, History, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useScribe } from "../../context/scribe-context"

export function ScribeSidecar() {
  const { isSidecarOpen, toggleSidecar, sidecarView, setSidecarView } = useScribe()

  if (!isSidecarOpen) return null

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full animate-in slide-in-from-right duration-300">
      {/* Sidecar Header */}
      <div className="h-12 border-b flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md">
          <Button 
            variant={sidecarView === 'chat' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 px-2 text-xs gap-1.5"
            onClick={() => setSidecarView('chat')}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Chat
          </Button>
          <Button 
            variant={sidecarView === 'history' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 px-2 text-xs gap-1.5"
            onClick={() => setSidecarView('history')}
          >
            <History className="h-3.5 w-3.5" />
            History
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSidecar()}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidecar Content */}
      <div className="flex-1 overflow-hidden">
        {sidecarView === 'chat' && (
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold mb-2">AI Assistant</h3>
            <div className="flex-1 bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground italic">
              {/* TODO: Implement ChatMessageList component */}
              Start a new conversation to explore the consultation context...
            </div>
            <div className="mt-4">
               {/* TODO: Implement ChatInput component */}
               <div className="h-10 border rounded-md px-3 flex items-center text-sm text-muted-foreground bg-background">
                 Ask a question...
               </div>
            </div>
          </div>
        )}

        {sidecarView === 'history' && (
          <div className="p-4 h-full">
            <h3 className="text-sm font-semibold mb-3">Patient History</h3>
            <div className="space-y-3">
              {/* TODO: Implement HistoryTimeline component */}
              <div className="border rounded-md p-3 space-y-1">
                <p className="text-xs font-medium">Follow-up Consultation</p>
                <p className="text-[10px] text-muted-foreground">Jan 18, 2024 • In Progress</p>
              </div>
              <div className="border rounded-md p-3 space-y-1 bg-primary/5 border-primary/20">
                <p className="text-xs font-medium">Annual Checkup</p>
                <p className="text-[10px] text-muted-foreground">Jan 15, 2024 • Completed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

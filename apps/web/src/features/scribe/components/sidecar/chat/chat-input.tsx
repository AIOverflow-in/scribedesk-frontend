import * as React from "react"
import { Paperclip, SquareSlash, Mic, ArrowUp, Fingerprint } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useScribe } from "../../../context/scribe-context"
import { cn } from "@workspace/ui/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

export function ChatInput() {
  const { consultation } = useScribe()
  const [message, setMessage] = React.useState("")
  
  return (
    <TooltipProvider>
      <div className="border rounded-2xl bg-background shadow-sm overflow-hidden flex flex-col p-3 focus-within:ring-1 focus-within:ring-primary/20 transition-all border-zinc-200 dark:border-zinc-800">
         {/* Top Row: Session Identity Bar (No border, neutral greys) */}
         <div className="w-fit flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-zinc-50 dark:bg-zinc-800/50 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <Fingerprint className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="text-[11.5px] font-semibold text-zinc-700 dark:text-zinc-200 truncate max-w-[160px]">
                {consultation?.title || "Draft Session"}
              </span>
            </div>
            <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
              {consultation?.patient.name || "Unknown Patient"}
            </span>
         </div>

         {/* Middle: Textarea */}
         <textarea 
           placeholder="Ask clinical assistant..."
           className="w-full bg-transparent resize-none outline-none text-sm min-h-[50px] py-1 placeholder:text-muted-foreground/40 leading-snug"
           value={message}
           onChange={(e) => setMessage(e.target.value)}
         />

         {/* Bottom: Controls */}
         <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-0.5">
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer">
                      <Paperclip className="h-4 w-4" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="top">Upload file</TooltipContent>
               </Tooltip>

               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer">
                      <SquareSlash className="h-4 w-4" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="top">Shortcuts</TooltipContent>
               </Tooltip>
            </div>

            <div className="flex items-center gap-2">
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 cursor-pointer">
                      <Mic className="h-4.5 w-4.5" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="top">Dictate</TooltipContent>
               </Tooltip>

               <Button 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 rounded-lg transition-all shadow-xs cursor-pointer",
                    message.trim() ? "bg-primary text-white" : "bg-muted text-muted-foreground opacity-50"
                  )}
                  disabled={!message.trim()}
               >
                  <ArrowUp className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
    </TooltipProvider>
  )
}

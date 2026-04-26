import * as React from "react"
import { Trash2, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { ChatThread } from "../../types"

interface ChatListItemProps {
  thread: ChatThread
  isActive: boolean
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

export function ChatListItem({ thread, isActive, onClick, onDelete }: ChatListItemProps) {
  return (
    <div 
      className={cn(
        "group relative flex items-center gap-4 p-4 transition-all cursor-pointer",
        isActive 
          ? "bg-primary/5 ring-1 ring-primary/10" 
          : "bg-background hover:bg-muted/80"
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <h4 className={cn(
          "text-base font-semibold truncate",
          isActive ? "text-primary" : "text-foreground"
        )}>
          {thread.title}
        </h4>
        <div className="text-xs text-muted-foreground">
          <span>Last message</span>
          <span className="font-medium"> 3 hours ago</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
         <Button 
           variant="ghost" 
           size="icon" 
           className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
           onClick={onDelete}
         >
           <Trash2 className="h-4 w-4" />
         </Button>
         <ChevronRight className={cn(
           "h-4 w-4 transition-all text-muted-foreground/30",
           isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
         )} />
      </div>
    </div>
  )
}

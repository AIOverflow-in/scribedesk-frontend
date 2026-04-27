import * as React from "react"
import { Trash2, ChevronRight, MoreHorizontal, Star } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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
      className="group relative z-0 flex items-center gap-4 p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className={cn(
        "absolute inset-0 rounded-xl transition-colors pointer-events-none -z-10",
        isActive ? "bg-primary/5 ring-1 ring-primary/10" : "group-hover:bg-muted/80"
      )} />
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <h4 className={cn(
          "text-base font-medium truncate",
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
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 hover:bg-muted-foreground/10 data-[state=open]:bg-muted-foreground/10 transition-all cursor-pointer"
               onClick={(e) => e.stopPropagation()}
             >
               <MoreHorizontal className="h-4 w-4" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-40">
             <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
               <Star className="mr-2 h-4 w-4 text-muted-foreground" />
               <span>Star chat</span>
             </DropdownMenuItem>
             <DropdownMenuItem 
               className="text-destructive focus:text-destructive cursor-pointer"
               onClick={(e) => {
                 e.stopPropagation()
                 onDelete(e)
               }}
             >
               <Trash2 className="mr-2 h-4 w-4" />
               <span>Delete chat</span>
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
      </div>
    </div>
  )
}

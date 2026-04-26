import * as React from "react"
import { SquarePen, Maximize2, X, ChevronDown, Trash2, Clock } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@workspace/ui/components/popover"
import { useScribe } from "../../../context/scribe-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

export function ChatHeader() {
  const { chats, activeChatId, setActiveChatId, createNewChat, toggleSidecar } = useScribe()

  const activeChat = chats.find(c => c.id === activeChatId)

  return (
    <div className="h-16 flex items-center justify-between px-4 bg-background shrink-0">
      {/* Left: Chat Title Popover */}
      <div className="flex-1 min-w-0 mr-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer outline-none text-left">
              <span className="text-lg font-semibold text-foreground tracking-tight">
                {activeChat?.title || "New Chat"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-2">
            <div className="space-y-1">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-md text-left transition-all group/item cursor-pointer",
                    chat.id === activeChatId ? "bg-muted" : "hover:bg-muted"
                  )}
                >
                  <div className="flex flex-col gap-1 min-w-0 pr-2">
                    <span className="text-base font-normal text-foreground truncate">
                      {chat.title}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                       <Clock className="h-3 w-3" />
                       3 hours ago
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 gap-2 px-3 text-sm font-semibold cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted" 
          onClick={createNewChat}
        >
          <SquarePen className="h-5 w-5" />
          New chat
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted">
              <Maximize2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Full Screen</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => toggleSidecar()}>
              <X className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Close chat</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

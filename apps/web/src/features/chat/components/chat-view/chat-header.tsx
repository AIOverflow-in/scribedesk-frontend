import * as React from "react"
import { Link } from "@tanstack/react-router"
import { SquarePen, Maximize2, X, ChevronDown, Trash2, Clock, ArrowLeft, Star } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@workspace/ui/components/popover"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@workspace/ui/components/button-group"
import { useChatStore } from "../../stores/chat-store"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

export function ChatHeader({ mode = 'workspace', onClose }: { mode?: 'sidecar' | 'workspace', onClose?: () => void }) {
  const { threads, activeThreadId, setActiveThread, createThread, deleteThread } = useChatStore()
  const activeThread = threads.find(t => t.id === activeThreadId)

  if (mode === 'workspace') {
    return (
      <div className="h-16 flex items-center justify-between px-4 bg-background shrink-0">
        {/* Left: Back Button & Title Dropdown Group */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer" asChild>
            <Link to="/chats">
              <ArrowLeft className="h-4.5 w-4.5" />
            </Link>
          </Button>

          {activeThread ? (
            <Popover>
              <ButtonGroup className="group/bg rounded-lg transition-colors hover:bg-muted border border-transparent">
                <Button variant="ghost" className="font-medium text-base hover:bg-transparent cursor-pointer px-3 h-9" asChild>
                  <div className="truncate">{activeThread.title}</div>
                </Button>
                <ButtonGroupSeparator className="opacity-0 group-hover/bg:opacity-100 transition-opacity" />
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-transparent cursor-pointer rounded-r-lg rounded-l-none border-l-0">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
              </ButtonGroup>

              <PopoverContent align="start" className="w-48 p-2">
                <div className="flex flex-col gap-1">
                   <Button variant="ghost" className="w-full justify-start text-sm cursor-pointer hover:bg-muted">
                      <Star className="h-4 w-4 mr-2" />
                      Star chat
                   </Button>
                   <Button 
                     variant="ghost" 
                     className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                     onClick={() => {
                       deleteThread(activeThread.id)
                     }}
                   >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete chat
                   </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="px-3 py-1.5 rounded-lg transition-colors hover:bg-muted font-medium text-base">
              New Chat
            </div>
          )}
        </div>
      </div>
    )
  }

  // mode === 'sidecar'
  return (
    <div className="h-16 flex items-center justify-between px-4 bg-background shrink-0">
      {/* Left: Chat History Popover */}
      <div className="flex-1 min-w-0 mr-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer outline-none text-left">
              <span className="text-lg font-semibold text-foreground tracking-tight">
                {activeThread?.title || "New Chat"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-2">
            <div className="space-y-1">
              {threads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setActiveThread(thread.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-md text-left transition-all group/item cursor-pointer",
                    thread.id === activeThreadId ? "bg-muted" : "hover:bg-muted"
                  )}
                >
                  <div className="flex flex-col gap-1 min-w-0 pr-2">
                    <span className="text-base font-normal text-foreground truncate">
                      {thread.title}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteThread(thread.id)
                    }}
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
          onClick={() => createThread()}
        >
          <SquarePen className="h-5 w-5" />
          New chat
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted" asChild>
              <Link to="/chats/$id" params={{ id: activeThreadId || 'new' } as any}>
                <Maximize2 className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Full Screen</TooltipContent>
        </Tooltip>

        {onClose && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Close chat</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

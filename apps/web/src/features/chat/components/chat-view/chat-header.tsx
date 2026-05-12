import * as React from "react"
import { Link, useNavigate } from "@tanstack/react-router"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { useChatStore } from "../../stores/chat-store"
import { useChatConversations } from "../../hooks/use-chat-conversations"
import { useDeleteChat } from "../../hooks/use-delete-chat"
import type { ChatThread } from "../../types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { NativeScroll } from "@workspace/ui/components/native-scroll"
import { formatRelativeTime } from "@/shared/utils/time"

interface ChatHeaderProps {
  mode?: 'sidecar' | 'workspace'
  sessionId?: string
  onClose?: () => void
  onSelectThread?: (id: string | null) => void
}

export function ChatHeader({ mode = 'workspace', sessionId, onClose, onSelectThread }: ChatHeaderProps) {
  const navigate = useNavigate()
  const { data: conversationsData } = useChatConversations(
    mode === 'sidecar' && sessionId
      ? { pageSize: 50, sessionId }
      : { pageSize: 50 }
  )
  const { activeThreadId, localThreads, createLocalThread, setActiveThread } = useChatStore()
  const deleteMutation = useDeleteChat(
    mode === 'sidecar' ? { skipNavigation: true } : undefined
  )
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingThreadId, setDeletingThreadId] = React.useState<string | null>(null)

  const allThreads = React.useMemo<ChatThread[]>(() => {
    const serverThreads: ChatThread[] = (conversationsData?.items || []).map(
      (c) => ({ id: c.id, title: c.title, updatedAt: c.updated_at })
    )
    return [...serverThreads, ...localThreads]
  }, [conversationsData, localThreads])

  const activeThread = allThreads.find(t => t.id === activeThreadId)
  const deletingThread = allThreads.find(t => t.id === deletingThreadId) || activeThread

  const deletingTitle = deletingThread?.title || "this chat"

  const handleSelectThread = (id: string) => {
    if (mode === 'sidecar' && onSelectThread) {
      onSelectThread(id)
    } else {
      navigate({ to: '/chats/$id', params: { id } } as any)
    }
  }

  const handleNewChat = () => {
    if (mode === 'sidecar' && onSelectThread) {
      onSelectThread(null)
      setActiveThread(null)
      return
    }
    const id = createLocalThread(
      sessionId ? { type: "consultation", id: sessionId } : undefined
    )
    navigate({ to: '/chats/$id', params: { id } } as any)
  }

  return (
    <>
      {mode === 'workspace' ? (
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
                          setDeletingThreadId(activeThreadId)
                          setDeleteOpen(true)
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
      ) : (
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
                  {allThreads.length === 0 ? (
                    <div className="px-3 py-6 text-center">
                      <span className="text-sm text-muted-foreground">
                        No chats for this session yet
                      </span>
                    </div>
                  ) : (
                    <NativeScroll className="max-h-[280px] space-y-1">
                      {allThreads.map(thread => (
                        <div
                          key={thread.id}
                          onClick={() => handleSelectThread(thread.id)}
                          role="button"
                          tabIndex={0}
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
                               {formatRelativeTime(thread.updatedAt)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeletingThreadId(thread.id)
                              setDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </NativeScroll>
                  )}
                </PopoverContent>
            </Popover>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 gap-2 px-3 text-sm font-semibold cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleNewChat}
            >
              <SquarePen className="h-5 w-5" />
              New chat
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted" asChild>
                  <a
                    href={`/chats/${activeThreadId || 'new'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </a>
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
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{deletingTitle}&rdquo;
              and all its messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deletingThread) {
                  deleteMutation.mutate(deletingThread.id, {
                    onSuccess: () => {
                      if (mode === 'sidecar') {
                        handleNewChat()
                      }
                    },
                  })
                }
                setDeleteOpen(false)
                setDeletingThreadId(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

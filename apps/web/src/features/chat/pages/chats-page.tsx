import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { SquarePen, PenLine } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { PageHeader } from "@/shared/components/page-header"
import { useChatStore } from "../stores/chat-store"
import { useChatConversations } from "../hooks/use-chat-conversations"
import { useDeleteChat } from "../hooks/use-delete-chat"
import { ChatListItem } from "../components/chat-list/chat-list-item"
import { ChatSearch } from "../components/chat-list/chat-search"
import { 
  Empty, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle, 
  EmptyDescription 
} from "@workspace/ui/components/empty"
import type { ChatThread } from "../types"

export function ChatsPage() {
  const navigate = useNavigate()
  const { data: conversationsData, isLoading } = useChatConversations()
  const { localThreads, createLocalThread } = useChatStore()
  const deleteMutation = useDeleteChat()
  const [searchQuery, setSearchQuery] = React.useState("")

  const threadList = React.useMemo<ChatThread[]>(() => {
    const serverThreads: ChatThread[] = (conversationsData?.items || []).map(
      (c) => ({
        id: c.id,
        title: c.title,
        updatedAt: c.updated_at,
        lastMessageSnippet: undefined,
      })
    )
    return [...localThreads, ...serverThreads].filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [conversationsData, localThreads, searchQuery])

  const handleCreateChat = () => {
    const id = createLocalThread()
    navigate({ to: '/chats/$id', params: { id } } as any)
  }

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-8 py-10 gap-8">
      <PageHeader 
        title="Chats" 
        description="Manage and review your clinical conversations."
        actions={
          <Button 
            onClick={handleCreateChat} 
            className="gap-2 h-9 px-4 font-semibold shadow-sm cursor-pointer"
          >
            <SquarePen className="h-4 w-4" />
            New chat
          </Button>
        }
      >
        <ChatSearch value={searchQuery} onChange={setSearchQuery} />
      </PageHeader>

      {/* List Area */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : threadList.length > 0 ? (
          <ScrollArea className="flex-1">
            <div className="flex flex-col mb-10 [&>*:hover]:border-t-transparent [&>*:hover+*]:border-t-transparent [&>*:first-child]:border-t-0 *:border-t *:border-border">
              {threadList.map((thread) => (
                <ChatListItem
                  key={thread.id}
                  thread={thread}
                  isActive={false}
                  onClick={() => navigate({ to: '/chats/$id', params: { id: thread.id } } as any)}
                  onDelete={(e) => {
                    e.stopPropagation()
                    deleteMutation.mutate(thread.id)
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-20">
            <Empty className="border-none bg-transparent">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-16 bg-primary/10 text-primary shadow-xs">
                  <PenLine className="size-8" />
                </EmptyMedia>
                <EmptyTitle className="text-lg">No conversations found</EmptyTitle>
                <EmptyDescription>
                  {searchQuery ? `No chats match "${searchQuery}"` : "You haven't started any conversations yet."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </div>
    </div>
  )
}

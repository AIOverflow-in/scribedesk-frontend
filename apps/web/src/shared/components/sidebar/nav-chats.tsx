"use client"

import { useState, useMemo } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@workspace/ui/components/sidebar"
import { ChevronRightIcon, MoreHorizontal, Star, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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
import { useChatConversations } from "@/features/chat/hooks/use-chat-conversations"
import { useDeleteChat } from "@/features/chat/hooks/use-delete-chat"
import { cn } from "@workspace/ui/lib/utils"

export function NavChats() {
  const location = useLocation()
  const { data: conversationsData } = useChatConversations({ pageSize: 50 })
  const deleteMutation = useDeleteChat()
  const [activeMenuChatId, setActiveMenuChatId] = useState<string | null>(null)
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null)

  const recentChats = useMemo(() => {
    return (conversationsData?.items || []).slice(0, 10)
  }, [conversationsData])

  const deletingChat = deletingChatId
    ? recentChats.find((c) => c.id === deletingChatId)
    : null

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden py-0">
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <div className="flex flex-col gap-0">
            <div className="flex items-center justify-between pr-2 transition-all duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden">
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer w-fit pr-2 whitespace-nowrap">
                  Recent Chats
                  <ChevronRightIcon className="ml-1 size-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <Link
                to="/chats"
                className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                See all
              </Link>
            </div>

            <CollapsibleContent>
              <SidebarMenu>
                {recentChats.map((chat) => {
                  const isActive =
                    location.pathname === `/chats/${chat.id}` ||
                    activeMenuChatId === chat.id

                  return (
                    <SidebarMenuItem key={chat.id}>
                      <div
                        className={cn(
                          "group/item flex w-full items-center rounded-md transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        )}
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={chat.title}
                          className={cn(
                            !isActive && "group-hover/item:bg-transparent"
                          )}
                        >
                          <Link to="/chats/$id" params={{ id: chat.id } as any}>
                            <span className="truncate">{chat.title}</span>
                          </Link>
                        </SidebarMenuButton>

                        <DropdownMenu
                          onOpenChange={(open) =>
                            setActiveMenuChatId(open ? chat.id : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side="right"
                            align="start"
                            className="w-40"
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              <Star className="mr-2 size-4 text-muted-foreground" />
                              <span>Star chat</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => setDeletingChatId(chat.id)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              <span>Delete chat</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </SidebarGroup>

      <AlertDialog
        open={!!deletingChatId}
        onOpenChange={(o) => !o && setDeletingChatId(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{deletingChat?.title}&rdquo;
              and all its messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deletingChatId) {
                  deleteMutation.mutate(deletingChatId)
                }
                setDeletingChatId(null)
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

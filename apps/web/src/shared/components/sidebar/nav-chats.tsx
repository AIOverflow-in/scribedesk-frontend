"use client"

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
import { useChatStore } from "@/features/chat/stores/chat-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

export function NavChats() {
  const location = useLocation()
  const { threads, deleteThread } = useChatStore()
  
  // Show top 10 recent chats
  const recentChats = threads.slice(0, 10)

  return (
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
              {recentChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === `/chats/${chat.id}`}
                    tooltip={chat.title}
                  >
                    <Link to="/chats/$id" params={{ id: chat.id } as any}>
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-40">
                      <DropdownMenuItem className="cursor-pointer">
                        <Star className="mr-2 size-4 text-muted-foreground" />
                        <span>Star chat</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => deleteThread(chat.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        <span>Delete chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </SidebarGroup>
  )
}

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
import { ChevronRightIcon, MoreHorizontal } from "lucide-react"
import { useChatStore } from "@/features/chat/stores/chat-store"

export function NavChats() {
  const location = useLocation()
  const { threads } = useChatStore()
  
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
                  <SidebarMenuAction>
                    <MoreHorizontal className="size-4" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </SidebarGroup>
  )
}

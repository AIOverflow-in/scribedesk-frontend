"use client"

import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/contexts/AuthContext"

import { NavMain } from "@/shared/components/sidebar/nav-main"
import { NavChats } from "@/shared/components/sidebar/nav-chats"
import { NavUser } from "@/shared/components/sidebar/nav-user"
import { SidebarHeaderToggle } from "@/shared/components/sidebar/sidebar-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { 
  GalleryVerticalEndIcon, 
  AudioLinesIcon,
  UsersIcon, 
  SquarePenIcon,
  NotebookPen,
  CirclePlus
} from "lucide-react"

const data = {
  app: {
    name: "ScribeDesk",
    logo: <GalleryVerticalEndIcon />,
    plan: "Enterprise",
  },
  navMain: [
    {
      title: "Scribe",
      url: "/scribe",
      icon: <AudioLinesIcon />,
    },
    {
      title: "New Chat",
      url: "/chats/new",
      icon: <SquarePenIcon />,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: <UsersIcon />,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: <NotebookPen />,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const { setOpen } = useSidebar()
  const { user: authUser } = useAuth()

  const user = {
    name: authUser ? `${authUser.first_name} ${authUser.last_name ?? ""}`.trim() : "User",
    email: authUser?.email ?? "",
    avatar: authUser?.clinic?.logo_url ?? "/favicon.ico",
  }

  React.useEffect(() => {
    const lgQuery = window.matchMedia("(min-width: 1024px)")
    const mdQuery = window.matchMedia("(min-width: 768px) and (max-width: 1023px)")

    const handleLgChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setOpen(true)
    }

    const handleMdChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setOpen(false)
    }

    lgQuery.addEventListener("change", handleLgChange)
    mdQuery.addEventListener("change", handleMdChange)

    return () => {
      lgQuery.removeEventListener("change", handleLgChange)
      mdQuery.removeEventListener("change", handleMdChange)
    }
  }, [setOpen])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderToggle app={data.app} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground transition-colors"
                tooltip="New session"
                onClick={() => navigate({ to: "/scribe", search: { newSession: "true" } as any })}
              >
                <CirclePlus />
                <span>New session</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain} />
        <NavChats />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

"use client"

import * as React from "react"

import { NavMain } from "@/shared/components/sidebar/nav-main"
import { NavChats } from "@/shared/components/sidebar/nav-chats"
import { NavUser } from "@/shared/components/sidebar/nav-user"
import { SidebarHeaderToggle } from "@/shared/components/sidebar/sidebar-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { 
  GalleryVerticalEndIcon, 
  AudioLinesIcon,
  UsersIcon, 
  CircleCheckBigIcon,
  SquarePenIcon,
  NotebookPen
} from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/favicon.ico",
  },
  app: {
    name: "Acme Inc",
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
      url: "/chats/new", // TODO: Update to your actual route
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
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: <CircleCheckBigIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpen } = useSidebar()

  React.useEffect(() => {
    const lgQuery = window.matchMedia("(min-width: 1024px)")
    const mdQuery = window.matchMedia("(min-width: 768px) and (max-width: 1023px)")

    const handleLgChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setOpen(true)
    }

    const handleMdChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setOpen(false)
    }

    if (lgQuery.matches) setOpen(true)
    else if (mdQuery.matches) setOpen(false)

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
        <NavMain items={data.navMain} />
        <NavChats />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

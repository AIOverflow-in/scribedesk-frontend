"use client"

import * as React from "react"
import { useSidebar } from "@workspace/ui/components/sidebar"
import { PanelLeft } from "lucide-react"
import { AppHeader } from "@/shared/components/sidebar/app-header"
import { cn } from "@workspace/ui/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

interface SidebarHeaderToggleProps {
  app: {
    name: string
    logo: React.ReactNode
    plan?: string
  }
}

export function SidebarHeaderToggle({ app }: SidebarHeaderToggleProps) {
  const { toggleSidebar, state } = useSidebar()

  return (
    <div className="group/header relative flex h-8 w-full items-center">
      <div className="flex-1 min-w-0 transition-all duration-200 group-data-[state=expanded]:pr-9 group-data-[collapsible=icon]:group-hover/header:opacity-0 group-data-[collapsible=icon]:group-hover/header:invisible">
        <AppHeader app={app} />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleSidebar}
            className={cn(
              "absolute right-0 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 z-20 cursor-ew-resize",
              "hover:bg-sidebar-accent-foreground/10 hover:text-sidebar-accent-foreground",
              "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover/header:opacity-100 group-data-[collapsible=icon]:bg-sidebar-accent group-data-[collapsible=icon]:hover:bg-sidebar-accent-foreground/20"
            )}
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">
              {state === "expanded" ? "Close sidebar" : "Open sidebar"}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          {state === "expanded" ? "Close sidebar" : "Open sidebar"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

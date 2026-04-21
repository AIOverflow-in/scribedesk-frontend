import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

export function AppHeader({
  app,
}: {
  app: {
    name: string
    logo: React.ReactNode
    plan?: string
  }
}) {
  if (!app) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild className="hover:!bg-transparent hover:!text-sidebar-foreground data-[active]:!bg-transparent">
          <div className="flex items-center gap-2 cursor-default">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {app.logo}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight transition-all duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0">
              <span className="truncate font-medium">{app.name}</span>
              {app.plan && <span className="truncate text-xs">{app.plan}</span>}
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

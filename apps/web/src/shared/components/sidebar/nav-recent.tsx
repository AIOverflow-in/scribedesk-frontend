"use client"

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
} from "@workspace/ui/components/sidebar"
import { ChevronRightIcon } from "lucide-react"

export function NavRecent({
  items,
}: {
  items: {
    title: string
    url: string
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden py-0">
      <Collapsible asChild defaultOpen={true} className="group/collapsible">
        <div className="flex flex-col gap-0">
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="cursor-pointer w-fit pr-2">
              Recent
              <ChevronRightIcon className="ml-1 size-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span className="truncate">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </SidebarGroup>
  )
}

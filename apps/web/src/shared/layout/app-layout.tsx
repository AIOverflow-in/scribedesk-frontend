import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { AppSidebar } from "@/shared/components/sidebar/app-sidebar"
import { MainHeader } from "@/shared/layout/main-header"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-screen overflow-hidden">
          <MainHeader />
          <div className="flex flex-1 flex-col gap-6 p-6 pt-6 overflow-hidden">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

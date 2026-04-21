import { Bell, Search, Moon, Sun } from "lucide-react"
import { useTheme } from "@workspace/ui/components/theme-provider"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"

export function DashboardHeader() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b bg-background px-3">
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-3.5 self-center!" />
        </div>

        {/* Search Bar - Desktop */}
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="h-7 w-full rounded-sm bg-muted/50 pl-7 pr-2 text-[11px] focus:bg-background transition-colors"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-1">
        {/* Search - Mobile Icon */}
        <Button variant="ghost" size="icon" className="h-7 w-7 md:hidden">
          <Search className="h-3.5 w-3.5" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-7 w-7 relative">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}

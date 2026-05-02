import { useState, useRef, useCallback, useEffect } from "react"
import { Bell, Search, Moon, Sun, AudioLines, Users, NotebookPen, Settings } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useTheme } from "@workspace/ui/components/theme-provider"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"

const searchItems = [
  { id: "scribe", label: "Scribe", url: "/scribe", icon: AudioLines },
  { id: "patients", label: "Patients", url: "/patients", icon: Users },
  { id: "templates", label: "Templates", url: "/templates", icon: NotebookPen },
  { id: "settings-profile", label: "Settings — Profile", url: "/settings", params: { tab: "profile" }, icon: Settings },
  { id: "settings-clinic", label: "Settings — Clinic", url: "/settings", params: { tab: "clinic" }, icon: Settings },
  { id: "settings-billing", label: "Settings — Billing", url: "/settings", params: { tab: "billing" }, icon: Settings },
]

export function MainHeader() {
  const { setTheme, theme } = useTheme()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const filteredRef = useRef(searchItems)

  const filtered = searchItems.filter((item) => {
    if (!query.trim()) return false
    const q = query.toLowerCase()
    return (
      item.label.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    )
  })

  filteredRef.current = filtered

  const handleSelect = useCallback(
    (url: string, params?: Record<string, string>) => {
      setIsOpen(false)
      setQuery("")
      inputRef.current?.blur()
      navigate({ to: url as any, search: params as any })
    },
    [navigate]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = filteredRef.current
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % items.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length)
      } else if (e.key === "Enter" && items[selectedIndex]) {
        e.preventDefault()
        handleSelect(items[selectedIndex].url, items[selectedIndex].params)
      } else if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
        inputRef.current?.blur()
      }
    },
    [selectedIndex, handleSelect]
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const showDropdown = isOpen && query.trim()

  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b bg-background px-3">
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-3.5 self-center!" />
        </div>

        {/* Search Bar - Desktop */}
        <div ref={containerRef} className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (e.target.value.trim()) setIsOpen(true)
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true)
            }}
            onKeyDown={handleKeyDown}
            className="h-7 w-full rounded-sm bg-muted/50 pl-7 pr-7 text-[11px] focus:bg-background transition-colors"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("")
                setIsOpen(false)
                inputRef.current?.focus()
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
              </svg>
            </button>
          )}

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md z-50 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">No results found</div>
              ) : (
                filtered.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors",
                        i === selectedIndex ? "bg-accent text-accent-foreground" : "text-foreground"
                      )}
                      onMouseEnter={() => setSelectedIndex(i)}
                      onClick={() => handleSelect(item.url, item.params)}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{item.label}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">{item.url}</span>
                    </button>
                  )
                })
              )}
            </div>
          )}
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
          className="h-7 w-7 cursor-pointer"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-7 w-7 relative cursor-pointer">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}

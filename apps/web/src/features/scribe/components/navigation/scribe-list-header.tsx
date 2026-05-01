import { useState, useMemo } from "react"
import { Search, Filter, ArrowUpDown, Check, User, X } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"

export interface ScribeListHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: "created_at" | "title" | "patient_name"
  sortOrder: "asc" | "desc"
  onSortChange: (column: "created_at" | "title" | "patient_name", order: "asc" | "desc") => void
  filterPatientId: string | null
  onPatientFilterChange: (patientId: string | null) => void
  patients: any[]
}

const SORT_OPTIONS = [
  { label: "Newest First", column: "created_at" as const, order: "desc" as const },
  { label: "Oldest First", column: "created_at" as const, order: "asc" as const },
  { label: "Title A-Z", column: "title" as const, order: "asc" as const },
  { label: "Title Z-A", column: "title" as const, order: "desc" as const },
  { label: "Patient A-Z", column: "patient_name" as const, order: "asc" as const },
  { label: "Patient Z-A", column: "patient_name" as const, order: "desc" as const },
]

function patientDisplayName(p: any) {
  return [p.first_name, p.last_name].filter(Boolean).join(" ")
}

export function ScribeListHeader({
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  filterPatientId,
  onPatientFilterChange,
  patients,
}: ScribeListHeaderProps) {
  const [filterSearch, setFilterSearch] = useState("")

  const selectedPatient = filterPatientId ? patients.find((p) => p.id === filterPatientId) : null

  const filteredPatients = useMemo(() => {
    const q = filterSearch.toLowerCase().trim()
    if (!q) return patients.slice(0, 50)
    return patients.filter((p) => patientDisplayName(p).toLowerCase().includes(q))
  }, [patients, filterSearch])

  return (
    <div className="px-3 space-y-2 mb-4">
      {/* Filter and Sort on top right */}
      <div className="flex items-center justify-end gap-1 pt-2">
        <div className="flex-1 min-w-0">
          {selectedPatient && (
            <div className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary rounded-md px-2 py-1 w-fit max-w-full">
              <User className="size-3 shrink-0" />
              <span className="truncate">{patientDisplayName(selectedPatient)}</span>
              <button
                onClick={() => onPatientFilterChange(null)}
                className="ml-0.5 hover:bg-primary/20 rounded-sm p-0.5 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>

        <DropdownMenu onOpenChange={(open) => { if (open) setFilterSearch("") }}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-7 w-7 cursor-pointer shrink-0", filterPatientId ? "text-primary" : "text-muted-foreground")}
            >
              <Filter className="h-3.5 w-3.5" />
              <span className="sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <div className="p-0.5">
              <Input
                placeholder="Search patients..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onInput={(e) => e.stopPropagation()}
                className="h-7 text-xs rounded-sm"
              />
            </div>
            <DropdownMenuItem
              className="cursor-pointer text-xs"
              onClick={() => onPatientFilterChange(null)}
            >
              <span className="flex-1">All Patients</span>
              {!filterPatientId && <Check className="size-3 text-primary" />}
            </DropdownMenuItem>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredPatients.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  className="cursor-pointer text-xs"
                  onClick={() => onPatientFilterChange(p.id)}
                >
                  <User className="size-3 text-primary shrink-0" />
                  <span className="flex-1 truncate">{patientDisplayName(p)}</span>
                  {filterPatientId === p.id && <Check className="size-3 text-primary shrink-0" />}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground cursor-pointer shrink-0">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="sr-only">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {SORT_OPTIONS.filter((opt) => !filterPatientId || opt.column !== "patient_name").map((opt) => (
              <DropdownMenuItem
                key={opt.label}
                className="cursor-pointer"
                onClick={() => onSortChange(opt.column, opt.order)}
              >
                <span className="flex-1">{opt.label}</span>
                {sortBy === opt.column && sortOrder === opt.order && (
                  <Check className="size-3.5 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search bar below */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search consultations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 pl-7 pr-2 text-xs rounded-md"
        />
      </div>
    </div>
  )
}

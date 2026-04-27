import { Search } from "lucide-react"
import { Input } from "@workspace/ui/components/input"

export function TemplateSearch({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
      <Input 
        placeholder="Search clinical templates..." 
        className="pl-10 h-10 bg-background border-border hover:border-primary/20 focus-visible:ring-primary/20 transition-all rounded-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

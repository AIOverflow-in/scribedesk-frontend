import { FileText, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import type { Template } from "../types"

interface TemplateListItemProps {
  template: Template
  onClick: () => void
}

export function TemplateListItem({ template, onClick }: TemplateListItemProps) {
  return (
    <div 
      className="group relative z-0 flex items-center gap-4 p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-xl transition-colors group-hover:bg-muted/80 pointer-events-none -z-10" />
      
      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <FileText className="size-5 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-medium truncate text-foreground">
            {template.title}
          </h4>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
            {template.category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate max-w-[500px]">
          {template.description}
        </p>
      </div>

      <div className="flex items-center gap-2">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 hover:bg-muted-foreground/10 data-[state=open]:bg-muted-foreground/10 transition-all cursor-pointer"
               onClick={(e) => e.stopPropagation()}
             >
               <MoreHorizontal className="h-4 w-4" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-40">
             <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
               e.stopPropagation()
               onClick()
             }}>
               <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
               <span>Edit template</span>
             </DropdownMenuItem>
             <DropdownMenuItem 
               className="text-destructive focus:text-destructive cursor-pointer"
               onClick={(e) => {
                 e.stopPropagation()
               }}
             >
               <Trash2 className="mr-2 h-4 w-4" />
               <span>Delete</span>
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
      </div>
    </div>
  )
}

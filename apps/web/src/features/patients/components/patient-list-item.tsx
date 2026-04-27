import { User, Mail, Fingerprint, MoreHorizontal, Eye, Trash2 } from "lucide-react"
import type { Patient } from "../types/patient"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

interface PatientListItemProps {
  patient: Patient
  onClick: () => void
}

export function PatientListItem({ patient, onClick }: PatientListItemProps) {
  return (
    <div 
      className="group relative flex items-center gap-4 p-4 transition-all cursor-pointer bg-background hover:bg-muted/80 border-t border-border"
      onClick={onClick}
    >
      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <User className="size-5 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-medium truncate text-foreground">
            {patient.name}
          </h4>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
            {patient.gender}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Fingerprint className="size-3" />
            <span>{patient.identifier}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="size-3" />
            <span className="truncate max-w-[150px]">{patient.email}</span>
          </div>
        </div>
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
               <span>View details</span>
             </DropdownMenuItem>
             <DropdownMenuItem 
               className="text-destructive focus:text-destructive cursor-pointer"
               onClick={(e) => {
                 e.stopPropagation()
               }}
             >
               <Trash2 className="mr-2 h-4 w-4" />
               <span>Delete patient</span>
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
      </div>
    </div>
  )
}

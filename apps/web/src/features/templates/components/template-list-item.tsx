import * as React from "react"
import { FileText, Lock, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import type { Template } from "../types"

interface TemplateListItemProps {
  template: Template
  onClick: () => void
  onDelete: (templateId: string) => void
}

export function TemplateListItem({ template, onClick, onDelete }: TemplateListItemProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  return (
    <>
      <div
        className="group relative z-0 flex items-center gap-4 p-4 cursor-pointer"
        onClick={onClick}
      >
        <div className="absolute inset-0 rounded-xl transition-colors group-hover:bg-muted/80 pointer-events-none -z-10" />

        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="size-5 text-primary dark:text-blue-400" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-medium truncate text-foreground">
              {template.name}
            </h4>
            <span className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1",
              template.is_system
                ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                : "bg-muted text-muted-foreground"
            )}>
              {template.is_system && <Lock className="size-2.5" />}
              {template.is_system ? "System" : "Custom"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[500px]">
            {template.root_type.charAt(0).toUpperCase() + template.root_type.slice(1)}
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
                <span>{template.is_system ? "View" : "Edit"}</span>
              </DropdownMenuItem>
              {!template.is_system && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteOpen(true)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{template.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => onDelete(template.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

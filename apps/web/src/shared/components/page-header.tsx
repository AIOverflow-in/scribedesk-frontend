import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  children?: React.ReactNode 
  className?: string
}

export function PageHeader({ 
  title, 
  description, 
  actions, 
  children,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground font-heading">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
      {children && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  )
}

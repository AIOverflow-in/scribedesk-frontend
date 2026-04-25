import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface NativeScrollProps extends React.HTMLAttributes<HTMLDivElement> {}

const NativeScroll = React.forwardRef<HTMLDivElement, NativeScrollProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-button]:hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
NativeScroll.displayName = "NativeScroll"

export { NativeScroll }

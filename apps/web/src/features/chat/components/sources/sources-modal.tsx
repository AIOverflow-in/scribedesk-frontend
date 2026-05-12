import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { ExternalLink } from "lucide-react"
import type { CitationsArtifact } from "@workspace/schemas/chat"

interface SourcesModalProps {
  isOpen: boolean
  onClose: () => void
  citations: CitationsArtifact | undefined
}

export function SourcesModal({
  isOpen,
  onClose,
  citations,
}: SourcesModalProps) {
  if (!citations) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-xl! max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg font-semibold">
            Sources
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            References used to generate this response
          </DialogDescription>
        </DialogHeader>

        <div className="border-t" />

        <div className="flex-1 overflow-y-auto -mx-6 px-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/40 [&::-webkit-scrollbar-thumb:hover]:bg-border/60 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex flex-col">
            {citations.items.map((citation, idx) => (
              <a
                key={citation.id}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-start gap-3 py-3 hover:bg-muted/50 transition-colors ${idx > 0 ? "border-t border-border/50" : ""}`}
              >
                {citation.favicon && (
                  <img
                    src={citation.favicon}
                    alt=""
                    className="size-5 rounded-sm mt-0.5 shrink-0"
                  />
                )}
                <div className="flex-1 min-h-0">
                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {citation.title}
                  </h4>
                  {citation.domain && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {citation.domain}
                    </p>
                  )}
                  {citation.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {citation.description}
                    </p>
                  )}
                </div>
                <ExternalLink className="size-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

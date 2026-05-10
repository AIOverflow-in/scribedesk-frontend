import type { CitationsArtifact } from "@workspace/schemas/chat"

interface SourcesSectionProps {
  citations: CitationsArtifact | undefined
  onSourcesClick: (citations: CitationsArtifact) => void
}

export function SourcesSection({
  citations,
  onSourcesClick,
}: SourcesSectionProps) {
  if (!citations || citations.count === 0) return null

  const displayCitations = citations.items.slice(0, 3)

  return (
    <div
      className="flex items-center justify-end mt-2 cursor-pointer group"
      onClick={() => onSourcesClick(citations)}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 group-hover:bg-accent transition-colors">
        <div className="flex items-center -space-x-1">
          {displayCitations.map((citation) =>
            citation.favicon ? (
              <img
                key={citation.id}
                src={citation.favicon}
                alt=""
                className="size-4 rounded-sm border border-background"
                title={citation.title}
              />
            ) : null
          )}
        </div>
        <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
          Sources
        </span>
      </div>
    </div>
  )
}

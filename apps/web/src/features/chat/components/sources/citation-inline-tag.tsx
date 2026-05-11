import * as React from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CitationItem } from "@workspace/schemas/chat"
import { cn } from "@workspace/ui/lib/utils"

interface CitationInlineTagProps {
  citations: CitationItem[]
  citationIds: number[]
}

export function CitationInlineTag({
  citations,
  citationIds,
}: CitationInlineTagProps) {
  const [isHovering, setIsHovering] = React.useState(false)

  if (citationIds.length === 0) return null

  const activeCitations = citations.filter((c) =>
    citationIds.includes(c.id)
  )

  if (activeCitations.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
        {citationIds.length === 1
          ? `Source ${citationIds[0]}`
          : `Sources ${citationIds.join(",")}`}
      </span>
    )
  }

  const getCitationName = (id: number) => {
    const citation = activeCitations.find((c) => c.id === id)
    return citation?.name || citation?.title || `Source ${id}`
  }

  if (citationIds.length === 1) {
    const citation = activeCitations[0]
    if (!citation) return null

    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-all",
              isHovering
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {getCitationName(citationIds[0])}
          </span>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-72 p-0 gap-0 z-100"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <CitationContent citation={citation} />
        </HoverCardContent>
      </HoverCard>
    )
  }

  const firstName = getCitationName(citationIds[0])
  const extra = citationIds.length - 1

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-all",
            isHovering
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {firstName}
          <span
            className={
              isHovering
                ? "text-background/70"
                : "text-muted-foreground/70"
            }
          >
            +{extra}
          </span>
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-72 p-0 gap-0 z-100"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <MultipleCitationsContent citations={activeCitations} />
      </HoverCardContent>
    </HoverCard>
  )
}

function CitationContent({ citation }: { citation: CitationItem }) {
  const Wrapper = citation.url ? "a" : "div"
  const linkProps = citation.url
    ? { href: citation.url, target: "_blank", rel: "noopener noreferrer" as const }
    : {}

  return (
    <Wrapper {...linkProps} className="block">
      <div className="flex items-center gap-2 px-3 py-2 border-b">
        {citation.favicon && (
          <img src={citation.favicon} alt="" className="size-4 rounded-sm" />
        )}
        {citation.domain && (
          <span className="text-xs text-muted-foreground">
            {citation.domain}
          </span>
        )}
      </div>
      <div className="px-3 py-2">
        <h4 className="text-sm font-medium mb-1 line-clamp-2">
          {citation.title}
        </h4>
        {citation.description && (
          <p className="text-xs text-muted-foreground line-clamp-3">
            {citation.description}
          </p>
        )}
      </div>
    </Wrapper>
  )
}

function MultipleCitationsContent({
  citations,
}: {
  citations: CitationItem[]
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  if (!citations || citations.length === 0) return null

  const citation = citations[currentIndex]
  const showNav = citations.length > 1

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentIndex((prev) =>
      prev === 0 ? citations.length - 1 : prev - 1
    )
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentIndex((prev) =>
      prev === citations.length - 1 ? 0 : prev + 1
    )
  }

  const Wrapper = citation.url ? "a" : "div"
  const linkProps = citation.url
    ? { href: citation.url, target: "_blank", rel: "noopener noreferrer" as const }
    : {}

  return (
    <Wrapper {...linkProps} className="block">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-1">
          {showNav && (
            <>
              <button
                className="size-6 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={handlePrev}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                className="size-6 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={handleNext}
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}
        </div>
        {showNav && (
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1}/{citations.length}
          </span>
        )}
      </div>
      <div className="px-3 py-2">
        {citation.favicon && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={citation.favicon}
              alt=""
              className="size-4 rounded-sm"
            />
            {citation.domain && (
              <span className="text-xs text-muted-foreground">
                {citation.domain}
              </span>
            )}
          </div>
        )}
        <h4 className="text-sm font-medium mb-1 line-clamp-2">
          {citation.title}
        </h4>
        {citation.description && (
          <p className="text-xs text-muted-foreground line-clamp-3">
            {citation.description}
          </p>
        )}
      </div>
    </Wrapper>
  )
}

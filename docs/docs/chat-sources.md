This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
citation-inline-tag.tsx
index.ts
markdown-text.tsx
sources-modal.tsx
sources-section.tsx
```

# Files

## File: citation-inline-tag.tsx
```typescript
import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CitationItem } from "@workspace/schemas";

interface CitationInlineTagProps {
  citations: CitationItem[];
  citationIds: number[];
}

export function CitationInlineTag({
  citations,
  citationIds,
}: CitationInlineTagProps) {
  const [isHovering, setIsHovering] = useState(false);

  if (citationIds.length === 0) return null;

  const activeCitations = citations.filter((c) => citationIds.includes(c.id));

  if (activeCitations.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
        {citationIds.length === 1 ? `Source ${citationIds[0]}` : `Sources ${citationIds.join(",")}`}
      </span>
    );
  }

  const getCitationName = (id: number) => {
    const citation = activeCitations.find((c) => c.id === id);
    return citation?.name || citation?.title || `Source ${id}`;
  };

  if (citationIds.length === 1) {
    const citation = activeCitations[0];
    if (!citation) return null;

    const isDark = isHovering;

    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-all ${
              isDark
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"
            }`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {getCitationName(citationIds[0])}
          </span>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-72 p-0 gap-0 z-[100]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <CitationContent citation={citation} />
        </HoverCardContent>
      </HoverCard>
    );
  }

  const firstName = getCitationName(citationIds[0]);
  const extra = citationIds.length - 1;
  const isDark = isHovering;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-all ${
            isDark
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {firstName}
          <span className={isDark ? "text-background/70" : "text-muted-foreground/70"}>+{extra}</span>
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-72 p-0 gap-0 z-[100]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <MultipleCitationsContent citations={activeCitations} />
      </HoverCardContent>
    </HoverCard>
  );
}

function CitationContent({ citation }: { citation: CitationItem }) {
  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
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
    </a>
  );
}

function MultipleCitationsContent({ citations: activeCitations }: { citations: CitationItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!activeCitations || activeCitations.length === 0) {
    return null;
  }

  const citation = activeCitations[currentIndex];
  const showNav = activeCitations.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? activeCitations.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === activeCitations.length - 1 ? 0 : prev + 1));
  };

  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
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
            {currentIndex + 1}/{activeCitations.length}
          </span>
        )}
      </div>
      <div className="px-3 py-2">
        {citation.favicon && (
          <div className="flex items-center gap-2 mb-2">
            <img src={citation.favicon} alt="" className="size-4 rounded-sm" />
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
    </a>
  );
}
```

## File: index.ts
```typescript
export { MarkdownText } from "./markdown-text";
export { SourcesModal } from "./sources-modal";
export { SourcesSection } from "./sources-section";
export { CitationInlineTag } from "./citation-inline-tag";
export type { SourceInfo } from "@workspace/schemas";
```

## File: markdown-text.tsx
```typescript
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@workspace/ui/lib/utils";
import { CitationInlineTag } from "./citation-inline-tag";
import type { CitationItem } from "@workspace/schemas";

interface MarkdownTextProps {
  content: string;
  className?: string;
  citations?: CitationItem[];
}

export function MarkdownText({
  content,
  className,
  citations = [],
}: MarkdownTextProps) {
  return (
    <div
      className={cn(
        "text-sm leading-relaxed max-w-none overflow-x-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/20 [&::-webkit-scrollbar-thumb:hover]:bg-border/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden",
        "[&_strong]:font-semibold [&_em]:italic",
        "[&_h1]:text-lg [&_h1]:font-bold [&_h1]:my-6",
        "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-6",
        "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:my-4",
        "[&_code]:bg-muted [&_code]:px-0.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[10px]",
        "[&_pre]:bg-muted [&_pre]:p-2.5 [&_pre]:rounded [&_pre]:text-[10px] [&_pre]:my-4 [&_pre]:overflow-x-auto",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_table]:w-full [&_table]:text-xs [&_table]:border-collapse [&_table]:my-5",
        "[&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-muted/50",
        "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
        "[&_hr]:my-6 [&_hr]:border-border",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-4",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-4",
        "[&_li]:my-1",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          cite: ({ children }) => {
            const citeText = typeof children === "string" ? children : "";
            const ids = citeText.split(",").map(Number).filter(Boolean);
            return (
              <CitationInlineTag
                citations={citations}
                citationIds={ids}
              />
            );
          },
          p: ({ children }) => <p className="my-2">{children}</p>,
          br: () => <br />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

## File: sources-modal.tsx
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ExternalLink } from "lucide-react";
import type { CitationsArtifact } from "@workspace/schemas";

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  citations: CitationsArtifact | undefined;
}

export function SourcesModal({
  isOpen,
  onClose,
  citations,
}: SourcesModalProps) {
  if (!citations) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-xl! max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg font-semibold">Sources</DialogTitle>
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
  );
}
```

## File: sources-section.tsx
```typescript
import type { CitationsArtifact } from "@workspace/schemas";

interface SourcesSectionProps {
  citations: CitationsArtifact | undefined;
  onSourcesClick: (citations: CitationsArtifact) => void;
}

export function SourcesSection({
  citations,
  onSourcesClick,
}: SourcesSectionProps) {
  if (!citations || citations.count === 0) return null;

  const displayCitations = citations.items.slice(0, 3);

  return (
    <div className="flex items-center justify-end mt-2 cursor-pointer group" onClick={() => onSourcesClick(citations)}>
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
  );
}
```

import { useEffect, useRef } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { 
  $convertFromMarkdownString, 
  $convertToMarkdownString,
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  TEXT_FORMAT_TRANSFORMERS
} from "@lexical/markdown"
import { $getRoot } from "lexical"
import { $generateHtmlFromNodes } from "@lexical/html"
import { TABLE } from "./table-transformer"

export const CLINICAL_TRANSFORMERS = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  TABLE,
  ...TEXT_FORMAT_TRANSFORMERS
]

export function MarkdownSyncPlugin({ 
  initialMarkdown, 
  onChange,
  onTextChange,
  onHtmlChange
}: { 
  initialMarkdown: string, 
  onChange?: (markdown: string) => void,
  onTextChange?: (text: string) => void,
  onHtmlChange?: (html: string) => void
}) {
  const [editor] = useLexicalComposerContext()
  const isFirstRender = useRef(true)

  // Initialize state from Markdown on mount
  useEffect(() => {
    if (isFirstRender.current && initialMarkdown) {
      isFirstRender.current = false
      editor.update(() => {
        $convertFromMarkdownString(initialMarkdown, CLINICAL_TRANSFORMERS)
      })
    }
  }, [editor, initialMarkdown])

  // Sync state back to Markdown/Text/HTML on edit
  useEffect(() => {
    if (!onChange && !onTextChange && !onHtmlChange) return

    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return
      
      editorState.read(() => {
        if (onChange) {
          const markdown = $convertToMarkdownString(CLINICAL_TRANSFORMERS)
          onChange(markdown)
        }

        if (onTextChange) {
          const text = $getRoot().getTextContent()
          onTextChange(text)
        }

        if (onHtmlChange) {
          const html = $generateHtmlFromNodes(editor)
          onHtmlChange(html)
        }
      })
    })
  }, [editor, onChange, onTextChange, onHtmlChange])

  return null
}

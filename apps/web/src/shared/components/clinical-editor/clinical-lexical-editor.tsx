import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table"

import { ToolbarPlugin } from "./clinical-editor-toolbar"
import { MarkdownSyncPlugin, CLINICAL_TRANSFORMERS } from "./markdown-sync-plugin"

const theme = {
  paragraph: "mb-3 leading-relaxed",
  text: {
    bold: "font-bold text-gray-900",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through text-gray-500",
  },
  list: {
    ul: "list-disc ml-6 mb-3",
    ol: "list-decimal ml-6 mb-3",
    listitem: "mb-1 pl-1",
  },
  heading: {
    h1: "text-2xl font-bold mb-4 text-gray-900",
    h2: "text-xl font-bold mb-3 text-gray-900",
    h3: "text-lg font-bold mb-2 text-gray-900",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3",
  table: "w-full border-collapse mb-4 border border-gray-200",
  tableRow: "border-b border-gray-200",
  tableCell: "border border-gray-200 p-2 text-sm text-left",
  tableCellHeader: "bg-gray-50 font-bold border border-gray-200 p-2 text-sm text-left",
}

export interface ClinicalLexicalEditorProps {
  initialContent: string
  onChange?: (content: string) => void
  onTextChange?: (text: string) => void
  onHtmlChange?: (html: string) => void
  readOnly?: boolean
}

export function ClinicalLexicalEditor({ 
  initialContent, 
  onChange,
  onTextChange,
  onHtmlChange,
  readOnly = false
}: ClinicalLexicalEditorProps) {
  
  const initialConfig = {
    namespace: "ClinicalEditor",
    theme,
    editable: !readOnly,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      TableNode,
      TableCellNode,
      TableRowNode
    ],
    onError: (error: Error) => {
      console.error("Lexical Editor Error:", error)
    },
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full h-full flex flex-col flex-1">
        {!readOnly && <ToolbarPlugin />}
        <div className="relative flex-1 min-h-[300px] p-8 md:p-10 pt-4 md:pt-6">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="outline-none min-h-[300px] h-full" 
              />
            }
            placeholder={
              <div className="absolute top-4 md:top-6 left-8 md:left-10 text-muted-foreground pointer-events-none italic">
                Enter clinical notes...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <ListPlugin />
        <TablePlugin />
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={CLINICAL_TRANSFORMERS} />
        <MarkdownSyncPlugin initialMarkdown={initialContent} onChange={onChange} onTextChange={onTextChange} onHtmlChange={onHtmlChange} />
      </div>
    </LexicalComposer>
  )
}

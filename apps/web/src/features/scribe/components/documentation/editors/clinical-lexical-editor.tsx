import { useEffect, useRef, useState, useCallback } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { $setBlocksType, $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection"
import { $findMatchingParent } from "@lexical/utils"
import { $generateHtmlFromNodes } from "@lexical/html"
import { 
  $convertFromMarkdownString, 
  $convertToMarkdownString,
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  TEXT_FORMAT_TRANSFORMERS
} from "@lexical/markdown"
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, $getSelection, $isRangeSelection, $createParagraphNode, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_CRITICAL, $getRoot } from "lexical"
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list"
import { Bold, Italic, Underline, List, ListOrdered, Undo, Redo, Type, Heading1, Heading2, Heading3, Quote, Plus, Minus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

const CLINICAL_TRANSFORMERS = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  ...TEXT_FORMAT_TRANSFORMERS
]

function BlockFormatDropdown() {
  const [editor] = useLexicalComposerContext()
  const [blockType, setBlockType] = useState("paragraph")

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && parent.getKey() === "root"
            }) || anchorNode.getTopLevelElementOrThrow()

      const type = element.getType()
      if (type === "heading") {
        setBlockType(type + (element as HeadingNode).getTag())
      } else if (type === "list") {
        setBlockType(type + (element as ListNode).getTag())
      } else {
        setBlockType(type)
      }
    }
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, _newEditor) => {
        updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor, updateToolbar])

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }

  const getFormatIcon = (val: string) => {
    if (val === "paragraph") return <Type className="h-3.5 w-3.5" />
    if (val === "headingh1") return <Heading1 className="h-3.5 w-3.5" />
    if (val === "headingh2") return <Heading2 className="h-3.5 w-3.5" />
    if (val === "headingh3") return <Heading3 className="h-3.5 w-3.5" />
    if (val === "quote") return <Quote className="h-3.5 w-3.5" />
    if (val === "listul") return <List className="h-3.5 w-3.5" />
    if (val === "listol") return <ListOrdered className="h-3.5 w-3.5" />
    return null
  }

  const getFormatLabel = (val: string) => {
    if (val === "paragraph") return "Normal"
    if (val === "headingh1") return "Heading 1"
    if (val === "headingh2") return "Heading 2"
    if (val === "headingh3") return "Heading 3"
    if (val === "quote") return "Quote"
    if (val === "listul") return "Bullet List"
    if (val === "listol") return "Numbered List"
    return "Format"
  }

  return (
    <Select 
      value={blockType}
      onValueChange={(val) => {
        if (val === "paragraph") formatParagraph()
        else if (val === "headingh1") formatHeading("h1")
        else if (val === "headingh2") formatHeading("h2")
        else if (val === "headingh3") formatHeading("h3")
        else if (val === "quote") formatQuote()
        else if (val === "listul") editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        else if (val === "listol") editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      }}
    >
      <SelectTrigger className="w-[155px] h-8 text-xs font-medium border-transparent hover:bg-gray-100/50 shadow-none focus:ring-0 cursor-pointer">
        <SelectValue placeholder="Format">
          <div className="flex items-center gap-2">
            {getFormatIcon(blockType)} {getFormatLabel(blockType)}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="paragraph"><div className="flex items-center gap-2"><Type className="h-3.5 w-3.5"/> Normal</div></SelectItem>
        <SelectItem value="headingh1"><div className="flex items-center gap-2"><Heading1 className="h-3.5 w-3.5"/> Heading 1</div></SelectItem>
        <SelectItem value="headingh2"><div className="flex items-center gap-2"><Heading2 className="h-3.5 w-3.5"/> Heading 2</div></SelectItem>
        <SelectItem value="headingh3"><div className="flex items-center gap-2"><Heading3 className="h-3.5 w-3.5"/> Heading 3</div></SelectItem>
        <SelectItem value="quote"><div className="flex items-center gap-2"><Quote className="h-3.5 w-3.5"/> Quote</div></SelectItem>
        <SelectItem value="listul"><div className="flex items-center gap-2"><List className="h-3.5 w-3.5"/> Bullet List</div></SelectItem>
        <SelectItem value="listol"><div className="flex items-center gap-2"><ListOrdered className="h-3.5 w-3.5"/> Numbered List</div></SelectItem>
      </SelectContent>
    </Select>
  )
}

function FontSizeControl() {
  const [editor] = useLexicalComposerContext()
  const [fontSize, setFontSize] = useState("13px")

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const size = $getSelectionStyleValueForProperty(selection, "font-size", "13px")
      setFontSize(size || "13px")
    }
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor, updateToolbar])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor, updateToolbar])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateToolbar()
    })
  }, [editor, updateToolbar])

  const updateFontSize = useCallback((newSize: number) => {
    const sizeStr = `${newSize}px`
    setFontSize(sizeStr) 
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-size": sizeStr,
        })
      }
    })
  }, [editor])

  const currentSize = parseInt(fontSize) || 13

  return (
    <div className="flex items-center gap-0.5">
      <button 
        type="button"
        onClick={() => updateFontSize(Math.max(8, currentSize - 1))}
        className="p-1.5 hover:bg-gray-100 rounded transition-all text-gray-500 hover:text-gray-900 cursor-pointer"
        title="Decrease font size"
      >
        <Minus className="h-3 w-3" />
      </button>
      
      <span className="min-w-9 h-7 flex items-center justify-center bg-gray-50/50 rounded border border-gray-200 text-[13px] font-bold text-gray-700 select-none px-1.5">
        {currentSize}
      </span>
      
      <button 
        type="button"
        onClick={() => updateFontSize(Math.min(72, currentSize + 1))}
        className="p-1.5 hover:bg-gray-100 rounded transition-all text-gray-500 hover:text-gray-900 cursor-pointer"
        title="Increase font size"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}

// A simple toolbar that sits above the content
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white backdrop-blur-sm py-1 px-2">
      <BlockFormatDropdown />
      
      <div className="w-px h-6 bg-gray-200 mx-1" />

      <FontSizeControl />

      <div className="w-px h-6 bg-gray-200 mx-1" />
      
      <button 
        type="button" 
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} 
        className="p-1.5 hover:bg-gray-100 hover:shadow-sm rounded transition-all text-gray-600 hover:text-gray-900 cursor-pointer"
        title="Bold"
      >
        <Bold className="w-4 h-4"/>
      </button>
      <button 
        type="button" 
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} 
        className="p-1.5 hover:bg-gray-100 hover:shadow-sm rounded transition-all text-gray-600 hover:text-gray-900 cursor-pointer"
        title="Italic"
      >
        <Italic className="w-4 h-4"/>
      </button>
      <button 
        type="button" 
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} 
        className="p-1.5 hover:bg-gray-100 hover:shadow-sm rounded transition-all text-gray-600 hover:text-gray-900 cursor-pointer"
        title="Underline"
      >
        <Underline className="w-4 h-4"/>
      </button>
      
      <div className="w-px h-5 bg-gray-200 mx-1" />
      
      <button 
        type="button" 
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} 
        className="p-1.5 hover:bg-gray-100 hover:shadow-sm rounded transition-all text-gray-600 hover:text-gray-900 cursor-pointer"
        title="Bullet List"
      >
        <List className="w-4 h-4"/>
      </button>
      <button 
        type="button" 
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} 
        className="p-1.5 hover:bg-gray-100 hover:shadow-sm rounded transition-all text-gray-600 hover:text-gray-900 cursor-pointer"
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4"/>
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />
      
      <button 
        type="button" 
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} 
        className="p-1.5 hover:bg-gray-100 hover:shadow-sm rounded transition-all text-gray-600 hover:text-gray-900 cursor-pointer"
        title="Undo"
      >
        <Undo className="w-4 h-4"/>
      </button>
      <button 
        type="button" 
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} 
        className="p-1.5 hover:bg-gray-100 hover:shadow-sm rounded transition-all text-gray-600 hover:text-gray-900 cursor-pointer"
        title="Redo"
      >
        <Redo className="w-4 h-4"/>
      </button>
    </div>
  )
}

// Plugin to sync markdown in and out of the editor
function MarkdownSyncPlugin({ 
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
}

interface ClinicalLexicalEditorProps {
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
      QuoteNode
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
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={CLINICAL_TRANSFORMERS} />
        <MarkdownSyncPlugin initialMarkdown={initialContent} onChange={onChange} onTextChange={onTextChange} onHtmlChange={onHtmlChange} />
      </div>
    </LexicalComposer>
  )
}
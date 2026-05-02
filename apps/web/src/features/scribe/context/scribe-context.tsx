import { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import type { Consultation, Report } from "../types"

export type SidecarView = "chat" | "history" | "suggestions"

export interface ChatSession {
  id: string
  title: string
  createdAt: string
}

interface ScribeContextType {
  // Current active consultation
  consultation: Consultation | null
  setConsultation: (consultation: Consultation | null) => void

  // Document Selection Modal
  isDocModalOpen: boolean
  openDocModal: () => void
  closeDocModal: () => void

  // Edit Session Modal
  isEditModalOpen: boolean
  openEditModal: () => void
  closeEditModal: () => void

  // Drafting Sheet
  isSheetOpen: boolean
  activeDocument: Partial<Report> | null
  openSheet: (doc: Partial<Report>) => void
  closeSheet: () => void

  // Sidecar
  isSidecarOpen: boolean
  sidecarView: SidecarView
  toggleSidecar: (view?: SidecarView) => void
  setSidecarView: (view: SidecarView) => void

  // Chat State
  chats: ChatSession[]
  activeChatId: string | null
  setActiveChatId: (id: string | null) => void
  createNewChat: () => void

  // Actions
}

const ScribeContext = createContext<ScribeContextType | undefined>(undefined)

export function ScribeProvider({ children }: { children: ReactNode }) {
  const [consultation, setConsultation] = useState<Consultation | null>(null)

  // Modal/Sheet states
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeDocument, setActiveDocument] = useState<Partial<Report> | null>(null)

  // Sidecar states
  const [isSidecarOpen, setIsSidecarOpen] = useState(false)
  const [sidecarView, setSidecarView] = useState<SidecarView>("chat")

  // Chat states
  const [chats, setChats] = useState<ChatSession[]>([
    { id: "c1", title: "General Assistant", createdAt: new Date().toISOString() },
    { id: "c2", title: "Treatment Discussion", createdAt: new Date().toISOString() }
  ])
  const [activeChatId, setActiveChatId] = useState<string | null>("c1")

  const toggleSidecar = (view?: SidecarView) => {
    if (view && view !== sidecarView) {
      setSidecarView(view)
      setIsSidecarOpen(true)
    } else {
      setIsSidecarOpen(!isSidecarOpen)
    }
  }

  const createNewChat = () => {
    const newChat = {
      id: Math.random().toString(36).slice(2, 11),
      title: "New Conversation",
      createdAt: new Date().toISOString()
    }
    setChats(prev => [newChat, ...prev])
    setActiveChatId(newChat.id)
    setSidecarView("chat")
    setIsSidecarOpen(true)
  }

  const value = useMemo(() => ({
    consultation,
    setConsultation,
    isDocModalOpen,
    openDocModal: () => setIsDocModalOpen(true),
    closeDocModal: () => setIsDocModalOpen(false),
    isEditModalOpen,
    openEditModal: () => setIsEditModalOpen(true),
    closeEditModal: () => setIsEditModalOpen(false),
    isSheetOpen,
    activeDocument,
    openSheet: (doc: Partial<Report>) => {
      setActiveDocument(doc)
      setIsSheetOpen(true)
    },
    closeSheet: () => {
      setIsSheetOpen(false)
      setTimeout(() => setActiveDocument(null), 300)
    },
    isSidecarOpen,
    sidecarView,
    toggleSidecar,
    setSidecarView,
    chats,
    activeChatId,
    setActiveChatId,
    createNewChat,
  }), [consultation, isDocModalOpen, isEditModalOpen, isSheetOpen, activeDocument, isSidecarOpen, sidecarView, chats, activeChatId])

  return (
    <ScribeContext.Provider value={value}>
      {children}
    </ScribeContext.Provider>
  )
}

export function useScribe() {
  const context = useContext(ScribeContext)
  if (context === undefined) {
    throw new Error("useScribe must be used within a ScribeProvider")
  }
  return context
}

export function useScribeOptional() {
  return useContext(ScribeContext)
}

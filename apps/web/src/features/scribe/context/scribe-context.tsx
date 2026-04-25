import { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import type { Consultation, Report } from "../types"
import { mockReports } from "../data/mock-reports"

export type SidecarView = "chat" | "history" | "suggestions"

interface ScribeContextType {
  // Current active consultation (Hydrated from DB)
  consultation: Consultation | null
  setConsultation: (consultation: Consultation | null) => void
  
  // Document Selection Modal (Orchestrator)
  isDocModalOpen: boolean
  openDocModal: () => void
  closeDocModal: () => void
  
  // Drafting Sheet
  isSheetOpen: boolean
  activeDocument: Partial<Report> | null
  openSheet: (doc: Partial<Report>) => void
  closeSheet: () => void
  
  // Sidecar (AI Assistant & History)
  isSidecarOpen: boolean
  sidecarView: SidecarView
  toggleSidecar: (view?: SidecarView) => void
  setSidecarView: (view: SidecarView) => void
  
  // Actions
  generateDocument: (type: string, data?: any) => Promise<void>
}

const ScribeContext = createContext<ScribeContextType | undefined>(undefined)

export function ScribeProvider({ children }: { children: ReactNode }) {
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  
  // Modal/Sheet states
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeDocument, setActiveDocument] = useState<Partial<Report> | null>(null)

  // Sidecar states
  const [isSidecarOpen, setIsSidecarOpen] = useState(false)
  const [sidecarView, setSidecarView] = useState<SidecarView>("suggestions")

  const toggleSidecar = (view?: SidecarView) => {
    if (view && view !== sidecarView) {
      setSidecarView(view)
      setIsSidecarOpen(true)
    } else {
      setIsSidecarOpen(!isSidecarOpen)
    }
  }

  const generateDocument = async (type: string, data?: any) => {
    // TODO: Connect to backend FastAPI/Go generation endpoint
    setIsDocModalOpen(false)
    
    const mockKey = type === 'soap' ? 'soap-long' : type === 'referral' ? 'referral-letter-1' : null
    const mockData = mockKey ? mockReports[mockKey] : null

    setTimeout(() => {
      setActiveDocument({ 
        title: mockData?.title || `New ${type}`, 
        type: type,
        createdAt: new Date().toISOString(),
        content: mockData?.content || ""
      })
      setIsSheetOpen(true)
    }, 350)
  }

  const value = useMemo(() => ({
    consultation,
    setConsultation,
    isDocModalOpen,
    openDocModal: () => setIsDocModalOpen(true),
    closeDocModal: () => setIsDocModalOpen(false),
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
    generateDocument
  }), [consultation, isDocModalOpen, isSheetOpen, activeDocument, isSidecarOpen, sidecarView])

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

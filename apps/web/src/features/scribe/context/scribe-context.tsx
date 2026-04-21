import { createContext, useContext, useState, type ReactNode } from "react"
import type { Consultation, Report } from "../types"
import { DocumentTypeModal } from "../components/scribe-detail/document-type-modal"
import { DraftingSheet } from "../components/scribe-detail/drafting-sheet"

interface ScribeContextType {
  // Current active consultation
  consultation: Consultation | null
  setConsultation: (consultation: Consultation | null) => void
  
  // Document Selection Modal
  isDocModalOpen: boolean
  openDocModal: () => void
  closeDocModal: () => void
  
  // Drafting Sheet
  isSheetOpen: boolean
  activeDocument: Partial<Report> | null
  openSheet: (doc: Partial<Report>) => void
  closeSheet: () => void
  
  // Actions
  generateDocument: (type: string, context?: string) => Promise<void>
}

const ScribeContext = createContext<ScribeContextType | undefined>(undefined)

export function ScribeProvider({ children }: { children: ReactNode }) {
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  
  // Modal states
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeDocument, setActiveDocument] = useState<Partial<Report> | null>(null)

  const openDocModal = () => setIsDocModalOpen(true)
  const closeDocModal = () => setIsDocModalOpen(false)

  const openSheet = (doc: Partial<Report>) => {
    setActiveDocument(doc)
    setIsSheetOpen(true)
  }
  const closeSheet = () => {
    setIsSheetOpen(false)
    // Delay clearing the document so the sheet has time to animate out
    setTimeout(() => {
      setActiveDocument(null)
    }, 300)
  }

  const generateDocument = async (type: string, context?: string) => {
    // This will be implemented with AI logic later
    console.log(`Generating ${type} with context: ${context}`)
    closeDocModal()
    
    // Add a small delay to allow the Modal to unmount before opening the Sheet
    // This prevents the 'removeChild' on 'Node' error caused by overlapping Portals
    setTimeout(() => {
      openSheet({ 
        title: `New ${type}`, 
        type: type,
        createdAt: new Date().toISOString(),
        content: ""
      })
    }, 100)
  }

  return (
    <ScribeContext.Provider
      value={{
        consultation,
        setConsultation,
        isDocModalOpen,
        openDocModal,
        closeDocModal,
        isSheetOpen,
        activeDocument,
        openSheet,
        closeSheet,
        generateDocument
      }}
    >
      {children}
      <DocumentTypeModal />
      <DraftingSheet />
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

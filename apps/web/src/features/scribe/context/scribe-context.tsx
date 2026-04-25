import { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import type { Consultation, Report } from "../types"
import { mockReports } from "../data/mock-reports"

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
    // Simulate AI generation by picking a mock report or creating a placeholder
    console.log(`Generating ${type} with context: ${context}`)
    closeDocModal()
    
    // Default to the long version for SOAP notes to show multi-page capabilities
    const mockKey = type === 'soap' ? 'soap-long' : type === 'referral' ? 'referral-letter-1' : null
    const mockData = mockKey ? mockReports[mockKey] : null

    // Add a slightly longer delay to allow the Modal exit animation to finish
    // before the Sheet starts sliding in.
    setTimeout(() => {
      openSheet({ 
        title: mockData?.title || `New ${type}`, 
        type: type,
        createdAt: new Date().toISOString(),
        content: mockData?.content || ""
      })
    }, 350)
  }

  // Memoize the context value to prevent unnecessary re-renders
  // and maintain stability during HMR swaps of child components.
  const value = useMemo(() => ({
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
  }), [
    consultation, 
    isDocModalOpen, 
    isSheetOpen, 
    activeDocument
  ])

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

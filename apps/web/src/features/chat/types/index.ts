export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  status?: 'sending' | 'sent' | 'error'
  isStreaming?: boolean
}

export interface ChatThread {
  id: string
  title: string
  lastMessageSnippet?: string
  updatedAt: string
  isDraft?: boolean
  context?: {
    type: 'consultation' | 'patient' | 'global'
    id?: string
  }
}

export type ChatViewMode = 'list' | 'workspace'

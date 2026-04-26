import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatThread, ChatMessage } from '../types'

interface ChatState {
  threads: ChatThread[]
  activeThreadId: string | null
  messages: Record<string, ChatMessage[]> // Store messages by thread ID
  
  // Actions
  setActiveThread: (id: string | null) => void
  createThread: (context?: ChatThread['context']) => string
  updateThreadTitle: (id: string, title: string) => void
  deleteThread: (id: string) => void
  
  // Message Actions (Mocking the flow)
  addMessage: (threadId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  
  // TODO: Implement actual SSE and WS listeners in hooks/
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threads: [
        { id: '1', title: 'Treatment Protocol for Knee Pain', updatedAt: new Date().toISOString(), lastMessageSnippet: 'The patient should follow the RICE protocol...' },
        { id: '2', title: 'Medication Side Effects Review', updatedAt: new Date(Date.now() - 86400000).toISOString(), lastMessageSnippet: 'Wait, so Paracetamol is safe?' }
      ],
      activeThreadId: null,
      messages: {},

      setActiveThread: (id) => set({ activeThreadId: id }),

      createThread: (context) => {
        const newId = Math.random().toString(36).substring(7)
        const newThread: ChatThread = {
          id: newId,
          title: 'New Chat',
          updatedAt: new Date().toISOString(),
          isDraft: true,
          context
        }
        set((state) => ({
          threads: [newThread, ...state.threads],
          activeThreadId: newId
        }))
        return newId
      },

      updateThreadTitle: (id, title) => set((state) => ({
        threads: state.threads.map(t => t.id === id ? { ...t, title, isDraft: false } : t)
      })),

      deleteThread: (id) => set((state) => ({
        threads: state.threads.filter(t => t.id !== id),
        activeThreadId: state.activeThreadId === id ? null : state.activeThreadId
      })),

      addMessage: (threadId, messageData) => {
        const newMessage: ChatMessage = {
          ...messageData,
          id: Math.random().toString(36).substring(7),
          createdAt: new Date().toISOString()
        }

        set((state) => {
          const threadMessages = state.messages[threadId] || []
          
          // Reorder logic: Move this thread to top of list
          const threadIndex = state.threads.findIndex(t => t.id === threadId)
          let updatedThreads = [...state.threads]
          if (threadIndex > -1) {
            const thread = { 
              ...updatedThreads[threadIndex], 
              updatedAt: new Date().toISOString(),
              lastMessageSnippet: messageData.content.substring(0, 60)
            }
            updatedThreads.splice(threadIndex, 1)
            updatedThreads.unshift(thread)
          }

          return {
            messages: {
              ...state.messages,
              [threadId]: [...threadMessages, newMessage]
            },
            threads: updatedThreads
          }
        })
      }
    }),
    {
      name: 'clinical-chat-storage',
      partialize: (state) => ({ threads: state.threads }) // Only persist the list, not messages for now
    }
  )
)

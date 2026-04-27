import { create } from 'zustand'
import type { ChatThread, ChatMessage } from '../types'
import { mockThreads, mockMessages } from '../data/mock-chats'

interface ChatState {
  threads: ChatThread[]
  activeThreadId: string | null
  messages: Record<string, ChatMessage[]>
  
  // Actions
  setActiveThread: (id: string | null) => void
  createThread: (context?: ChatThread['context']) => string
  updateThreadTitle: (id: string, title: string) => void
  deleteThread: (id: string) => void
  addMessage: (threadId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) => void
}

export const useChatStore = create<ChatState>((set) => ({
  // Initialize with Mocks directly (No persistence for now to avoid hydration bugs)
  threads: mockThreads,
  activeThreadId: null,
  messages: mockMessages,

  setActiveThread: (id) => set({ activeThreadId: id }),

  createThread: (context) => {
    const newId = `new-${Math.random().toString(36).substring(7)}`
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
      const threadIndex = state.threads.findIndex(t => t.id === threadId)
      let updatedThreads = [...state.threads]
      
      if (threadIndex > -1) {
        const thread = { 
          ...updatedThreads[threadIndex], 
          updatedAt: new Date().toISOString(),
          lastMessageSnippet: messageData.content.substring(0, 60),
          isDraft: false
        }
        updatedThreads.splice(threadIndex, 1)
        updatedThreads.unshift(thread)
      }

      return {
        messages: { ...state.messages, [threadId]: [...threadMessages, newMessage] },
        threads: updatedThreads
      }
    })
  }
}))

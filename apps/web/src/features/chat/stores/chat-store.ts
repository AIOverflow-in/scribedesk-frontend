import { create } from 'zustand'
import type { ChatThread, ChatMessage } from '../types'
import type { CitationItem } from "@workspace/schemas/chat"

interface ToolCallState {
  toolName: string
  statusMessage: string
  hasResult: boolean
}

interface ChatState {
  activeThreadId: string | null
  localThreads: ChatThread[]
  messages: Record<string, ChatMessage[]>

  streamingContent: string
  streamingStatus: 'idle' | 'sending' | 'streaming' | 'error'
  streamingStatusMessage: string
  streamingToolCalls: ToolCallState[]
  streamingConversationId: string | null
  citationsByThread: Record<string, CitationItem[]>

  // Actions
  setActiveThread: (id: string | null) => void
  setMessages: (threadId: string, msgs: ChatMessage[]) => void
  addMessage: (threadId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  updateThreadTitle: (id: string, title: string) => void

  createLocalThread: (
    context?: ChatThread['context'],
    opts?: { addToList?: boolean }
  ) => string
  promoteLocalThread: (localId: string, serverId: string) => void
  removeLocalThread: (id: string) => void

  appendStreamingContent: (threadId: string, content: string) => void
  setStreamingStatusMessage: (msg: string) => void
  setCitations: (threadId: string, items: CitationItem[]) => void
  setStreamingToolCall: (threadId: string, tool: ToolCallState) => void
  setStreamingConversationId: (id: string | null) => void
  completeStreaming: (threadId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  activeThreadId: null,
  localThreads: [],
  messages: {},

  streamingContent: '',
  streamingStatus: 'idle',
  streamingStatusMessage: '',
  streamingToolCalls: [],
  streamingConversationId: null,
  citationsByThread: {},

  setActiveThread: (id) => set({ activeThreadId: id }),

  setMessages: (threadId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [threadId]: msgs },
    })),

  addMessage: (threadId, messageData) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    }

    set((state) => {
      const threadMessages = state.messages[threadId] || []
      return {
        messages: {
          ...state.messages,
          [threadId]: [...threadMessages, newMessage],
        },
      }
    })
  },

  updateThreadTitle: (id, title) =>
    set((state) => ({
      localThreads: state.localThreads.map((t) =>
        t.id === id ? { ...t, title, isDraft: false } : t
      ),
    })),

  createLocalThread: (context, opts) => {
    const newId = `local-${Math.random().toString(36).substring(7)}`
    const addToList = opts?.addToList !== false

    if (addToList) {
      const newThread: ChatThread = {
        id: newId,
        title: 'New Chat',
        updatedAt: new Date().toISOString(),
        isDraft: true,
        context,
      }
      set((state) => ({
        localThreads: [newThread, ...state.localThreads],
        activeThreadId: newId,
      }))
    } else {
      set({ activeThreadId: newId })
    }
    return newId
  },

  promoteLocalThread: (localId, serverId) =>
    set((state) => ({
      localThreads: state.localThreads.filter((t) => t.id !== localId),
      messages: {
        ...state.messages,
        [serverId]: state.messages[localId] || [],
      },
      activeThreadId: serverId,
    })),

  removeLocalThread: (id) =>
    set((state) => ({
      localThreads: state.localThreads.filter((t) => t.id !== id),
      activeThreadId:
        state.activeThreadId === id ? null : state.activeThreadId,
    })),

  appendStreamingContent: (threadId, content) =>
    set((state) => {
      const currentMessages = state.messages[threadId] || []
      const lastMessage = currentMessages[currentMessages.length - 1]

      if (lastMessage?.isStreaming) {
        const updated = [...currentMessages]
        updated[updated.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
        }
        return { messages: { ...state.messages, [threadId]: updated } }
      }

      return {
        messages: {
          ...state.messages,
          [threadId]: [
            ...currentMessages,
            {
              id: `stream-${Math.random().toString(36).substring(7)}`,
              role: 'assistant',
              content,
              createdAt: new Date().toISOString(),
              isStreaming: true,
            },
          ],
        },
        streamingContent: state.streamingContent + content,
      }
    }),

  setStreamingToolCall: (threadId, tool) =>
    set((state) => {
      const existing = state.streamingToolCalls.findIndex(
        (t) => t.toolName === tool.toolName && !t.hasResult
      )
      if (tool.hasResult && existing >= 0) {
        const updated = [...state.streamingToolCalls]
        updated[existing] = tool
        return { streamingToolCalls: updated }
      }
      if (!tool.hasResult && existing === -1) {
        return {
          streamingToolCalls: [...state.streamingToolCalls, tool],
        }
      }
      return {}
    }),

  setStreamingStatusMessage: (msg) => set({ streamingStatusMessage: msg }),
  setCitations: (threadId, items) =>
    set((state) => ({
      citationsByThread: { ...state.citationsByThread, [threadId]: items },
    })),

  setStreamingConversationId: (id) => set({ streamingConversationId: id }),

  completeStreaming: (threadId) =>
    set((state) => {
      const threadCites = state.citationsByThread[threadId]
      const hasCitations = threadCites && threadCites.length > 0
      const citationsByThread = { ...state.citationsByThread }
      delete citationsByThread[threadId]
      return {
        streamingContent: '',
        streamingStatus: 'idle',
        streamingStatusMessage: '',
        streamingToolCalls: [],
        streamingConversationId: null,
        citationsByThread,
        messages: {
          ...state.messages,
          [threadId]: (state.messages[threadId] || []).map((m) =>
            m.isStreaming
              ? {
                  ...m,
                  isStreaming: false,
                  artifacts: hasCitations
                    ? {
                        citations: {
                          count: threadCites.length,
                          items: threadCites,
                        },
                      }
                    : m.artifacts,
                }
              : m
          ),
        },
      }
    }),
}))

import { create } from "zustand"

export type ScribeStatus = "idle" | "connecting" | "listening" | "processing" | "paused" | "stopped"
export type AudioSource = "mic" | "webrtc"

export interface LiveChunk {
  text: string
  timestamp: number
}

interface ScribeState {
  status: ScribeStatus
  audioSource: AudioSource
  isRecording: boolean
  isSaving: boolean
  recordingSessionId: string | null

  // Timer Logic
  baseDuration: number
  startTime: number | null

  // Ephemeral UI Data
  volume: number
  liveChunks: LiveChunk[]
  currentPartial: string
  activeChatId: string | null

  // Actions
  setStatus: (status: ScribeStatus) => void
  setRecording: (isRecording: boolean, baseSeconds?: number) => void
  setSaving: (saving: boolean) => void
  setVolume: (volume: number) => void
  addLiveChunk: (text: string, timestamp: number) => void
  setCurrentPartial: (text: string) => void
  setActiveChatId: (id: string | null) => void
  setRecordingSessionId: (id: string | null) => void
  reset: () => void
}

export const useScribeStore = create<ScribeState>((set) => ({
  status: "idle",
  audioSource: "mic",
  isRecording: false,
  isSaving: false,
  recordingSessionId: null,
  baseDuration: 0,
  startTime: null,
  volume: 0,
  liveChunks: [],
  currentPartial: "",
  activeChatId: null,

  setStatus: (status) => set({ status }),

  setRecording: (isRecording, baseSeconds) => set((state) => ({
    isRecording,
    startTime: isRecording ? Date.now() : null,
    baseDuration: baseSeconds !== undefined ? baseSeconds : state.baseDuration,
  })),

  setSaving: (isSaving) => set({ isSaving }),

  setVolume: (volume) => set({ volume }),

  addLiveChunk: (text, timestamp) => set((state) => ({
    liveChunks: [...state.liveChunks, { text, timestamp }],
    currentPartial: "",
  })),

  setCurrentPartial: (text) => set({ currentPartial: text }),

  setActiveChatId: (activeChatId) => set({ activeChatId }),

  setRecordingSessionId: (recordingSessionId) => set({ recordingSessionId }),

  reset: () => set({
    status: "idle",
    isRecording: false,
    isSaving: false,
    recordingSessionId: null,
    baseDuration: 0,
    startTime: null,
    volume: 0,
    liveChunks: [],
    currentPartial: "",
    activeChatId: null,
  }),
}))

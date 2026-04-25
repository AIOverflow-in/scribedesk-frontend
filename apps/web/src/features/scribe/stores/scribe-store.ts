import { create } from "zustand"

export type ScribeStatus = "idle" | "connecting" | "listening" | "processing" | "paused" | "stopped"
export type AudioSource = "mic" | "webrtc"

interface ScribeState {
  // Session Status
  status: ScribeStatus
  audioSource: AudioSource
  isRecording: boolean
  
  // Timer Logic (Independent Calculation)
  baseDuration: number      // Seconds from DB
  startTime: number | null  // Date.now() when segment started
  
  // Ephemeral UI Data
  volume: number
  liveTranscript: string
  activeChatId: string | null
  
  // Actions
  setStatus: (status: ScribeStatus) => void
  setRecording: (isRecording: boolean, baseSeconds?: number) => void
  setVolume: (volume: number) => void
  appendTranscript: (text: string) => void
  setActiveChatId: (id: string | null) => void
  reset: () => void
  
  // TODO: Implement WS connection management
  // TODO: Implement audio stream mixing logic
}

export const useScribeStore = create<ScribeState>((set) => ({
  status: "idle",
  audioSource: "mic",
  isRecording: false,
  baseDuration: 0,
  startTime: null,
  volume: 0,
  liveTranscript: "",
  activeChatId: null,

  setStatus: (status) => set({ status }),
  
  setRecording: (isRecording, baseSeconds) => set((state) => ({ 
    isRecording,
    startTime: isRecording ? Date.now() : null,
    baseDuration: baseSeconds !== undefined ? baseSeconds : state.baseDuration
  })),

  setVolume: (volume) => set({ volume }),
  
  appendTranscript: (text) => set((state) => ({ 
    liveTranscript: state.liveTranscript + " " + text 
  })),

  setActiveChatId: (activeChatId) => set({ activeChatId }),

  reset: () => set({
    status: "idle",
    isRecording: false,
    baseDuration: 0,
    startTime: null,
    volume: 0,
    liveTranscript: "",
    activeChatId: null,
  }),
}))

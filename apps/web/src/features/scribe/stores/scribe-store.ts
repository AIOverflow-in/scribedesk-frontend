import { create } from "zustand"

export type ScribeStatus = "idle" | "connecting" | "listening" | "processing" | "stopped"
export type AudioSource = "mic" | "webrtc"

interface ScribeState {
  status: ScribeStatus
  audioSource: AudioSource
  isRecording: boolean
  volume: number
  liveTranscript: string
  
  // Actions
  setStatus: (status: ScribeStatus) => void
  setAudioSource: (source: AudioSource) => void
  setRecording: (isRecording: boolean) => void
  setVolume: (volume: number) => void
  appendTranscript: (text: string) => void
  clearTranscript: () => void
  reset: () => void
}

export const useScribeStore = create<ScribeState>((set) => ({
  status: "idle",
  audioSource: "mic",
  isRecording: false,
  volume: 0,
  liveTranscript: "",

  setStatus: (status) => set({ status }),
  setAudioSource: (audioSource) => set({ audioSource }),
  setRecording: (isRecording) => set({ isRecording }),
  setVolume: (volume) => set({ volume }),
  appendTranscript: (text) => set((state) => ({ 
    liveTranscript: state.liveTranscript + " " + text 
  })),
  clearTranscript: () => set({ liveTranscript: "" }),
  reset: () => set({
    status: "idle",
    isRecording: false,
    volume: 0,
    liveTranscript: "",
  }),
}))

"use client"

import { createContext, useContext, useRef, useCallback } from "react"
import { getWsToken } from "@/lib/ws-token"
import { useScribeStore } from "../stores/scribe-store"
import { AudioCapture, TARGET_SAMPLE_RATE } from "../lib/audio-capture"
import { toast } from "@workspace/ui/components/sonner"

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/v1/ws/scribe"

interface ScribeSessionContextValue {
  connect: (sessionId: string) => Promise<void>
  disconnect: () => void
}

const ScribeSessionContext = createContext<ScribeSessionContextValue | null>(null)

export function useScribeSession() {
  const ctx = useContext(ScribeSessionContext)
  if (!ctx) throw new Error("useScribeSession must be used within ScribeSessionProvider")
  return ctx
}

export function ScribeSessionProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null)
  const captureRef = useRef<AudioCapture | null>(null)
  const mixCtxRef = useRef<AudioContext | null>(null)

  const {
    setStatus,
    setRecording,
    setRecordingSessionId,
    addLiveChunk,
    appendPendingChunk,
    baseDuration,
    audioSource,
  } = useScribeStore()

  const connect = useCallback(async (sessionId: string) => {
    if (wsRef.current) return

    const token = getWsToken()
    if (!token) {
      console.error("No WS token available")
      return
    }

    let mixedStream: MediaStream | undefined

    if (audioSource === "webrtc") {
      let mixCtx: AudioContext
      try {
        mixCtx = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE })
      } catch {
        mixCtx = new AudioContext()
      }
      mixCtxRef.current = mixCtx

      try {
        const tabStream = await navigator.mediaDevices.getDisplayMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: true,
        })
        tabStream.getVideoTracks().forEach((t) => t.stop())

        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: { ideal: TARGET_SAMPLE_RATE },
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })

        const micSource = mixCtx.createMediaStreamSource(micStream)
        const tabSource = mixCtx.createMediaStreamSource(tabStream)
        const dest = mixCtx.createMediaStreamDestination()
        micSource.connect(dest)
        tabSource.connect(dest)
        mixedStream = dest.stream
      } catch (err: any) {
        mixCtxRef.current?.close()
        mixCtxRef.current = null
        if (err.name === "NotAllowedError") {
          toast.error("A Browser tab must be selected to start Telehealth session.")
        } else {
          toast.error("Failed to capture tab audio.")
        }
        return
      }
    }

    setStatus("connecting")
    setRecordingSessionId(sessionId)

    const ws = new WebSocket(`${WS_BASE}/${sessionId}?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus("listening")
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "ready") {
          setRecording(true, data.accumulated_seconds ?? baseDuration)
          const capture = new AudioCapture()
          captureRef.current = capture
          capture.start(ws, mixedStream).catch((err) => {
            console.error("[ScribeSession] Audio capture failed:", err)
            ws.close()
          })
        } else if (data.type === "transcript_partial") {
          appendPendingChunk(data.text)
        } else if (data.type === "transcript_chunk") {
          addLiveChunk(data.text, data.timestamp)
        } else if (data.type === "idle_timeout") {
          setStatus("paused")
          setRecording(false)
          captureRef.current?.stop()
          captureRef.current = null
          new Audio("/sounds/drop-002.mp3").play().catch(() => {})
          toast.info("No speech detected — transcription paused.")
        }
      } catch {
        // ignore
      }
    }

    ws.onclose = () => {
      setStatus("stopped")
      setRecording(false)
      setRecordingSessionId(null)
      captureRef.current?.stop()
      captureRef.current = null
      mixCtxRef.current?.close()
      mixCtxRef.current = null
      wsRef.current = null
    }

    ws.onerror = () => {
      setStatus("idle")
      setRecording(false)
      setRecordingSessionId(null)
      captureRef.current?.stop()
      captureRef.current = null
      mixCtxRef.current?.close()
      mixCtxRef.current = null
      wsRef.current = null
    }
  }, [baseDuration, audioSource, setStatus, setRecording, setRecordingSessionId, addLiveChunk, appendPendingChunk])

  const disconnect = useCallback(() => {
    captureRef.current?.stop()
    captureRef.current = null
    mixCtxRef.current?.close()
    mixCtxRef.current = null
    wsRef.current?.close()
    wsRef.current = null
    setRecordingSessionId(null)
  }, [setRecordingSessionId])

  return (
    <ScribeSessionContext.Provider value={{ connect, disconnect }}>
      {children}
    </ScribeSessionContext.Provider>
  )
}

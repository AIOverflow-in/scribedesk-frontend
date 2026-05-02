"use client";

import { useEffect, useRef, useCallback } from "react";
import { getWsToken } from "@/lib/ws-token";
import { useScribeStore } from "../stores/scribe-store";
import { AudioCapture } from "../lib/audio-capture";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/v1/ws/scribe";

export function useScribeWs(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const captureRef = useRef<AudioCapture | null>(null);

  const {
    setStatus,
    setRecording,
    setRecordingSessionId,
    addLiveChunk,
    appendPendingChunk,
    reset,
    baseDuration,
  } = useScribeStore();

  const connect = useCallback(async () => {
    if (!sessionId) return;

    const token = getWsToken();
    if (!token) {
      console.error("No WS token available");
      return;
    }

    setStatus("connecting");
    setRecordingSessionId(sessionId);

    const ws = new WebSocket(`${WS_BASE}/${sessionId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("listening");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ready") {
          setRecording(true, data.accumulated_seconds ?? baseDuration);
          // Backend Deepgram is ready — start sending audio
          const capture = new AudioCapture();
          captureRef.current = capture;
          capture.start(ws).catch((err) => {
            console.error("[useScribeWs] Audio capture failed:", err);
            ws.close();
          });
        } else if (data.type === "transcript_partial") {
          appendPendingChunk(data.text);
        } else if (data.type === "transcript_chunk") {
          addLiveChunk(data.text, data.timestamp);
        }
      } catch {
        // Not JSON, ignore
      }
    };

    ws.onclose = () => {
      setStatus("stopped");
      setRecording(false);
      setRecordingSessionId(null);
      captureRef.current?.stop();
      captureRef.current = null;
      wsRef.current = null;
    };

    ws.onerror = () => {
      setStatus("idle");
      setRecording(false);
      setRecordingSessionId(null);
      captureRef.current?.stop();
      captureRef.current = null;
      wsRef.current = null;
    };
  }, [sessionId, setStatus, setRecording, setRecordingSessionId, addLiveChunk, appendPendingChunk, baseDuration]);

  const disconnect = useCallback(() => {
    captureRef.current?.stop();
    captureRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    setRecordingSessionId(null);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
      reset();
    };
  }, [disconnect, reset]);

  return { connect, disconnect };
}

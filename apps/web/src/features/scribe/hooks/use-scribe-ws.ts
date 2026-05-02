"use client";

import { useEffect, useRef, useCallback } from "react";
import { getWsToken } from "@/lib/ws-token";
import { useScribeStore } from "../stores/scribe-store";
import { AudioCapture, TARGET_SAMPLE_RATE } from "../lib/audio-capture";
import { toast } from "@workspace/ui/components/sonner";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/v1/ws/scribe";

export function useScribeWs(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const captureRef = useRef<AudioCapture | null>(null);
  const mixCtxRef = useRef<AudioContext | null>(null);

  const {
    setStatus,
    setRecording,
    setRecordingSessionId,
    addLiveChunk,
    appendPendingChunk,
    reset,
    baseDuration,
    audioSource,
  } = useScribeStore();

  const connect = useCallback(async () => {
    if (!sessionId) return;

    const token = getWsToken();
    if (!token) {
      console.error("No WS token available");
      return;
    }

    let mixedStream: MediaStream | undefined;

    /* ── Telehealth: mix tab + mic audio BEFORE any WS activity ── */
    if (audioSource === "webrtc") {
      /* AudioContext MUST be created synchronously on user gesture,
         before any await, to avoid suspension. */
      let mixCtx: AudioContext;
      try {
        mixCtx = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE });
      } catch {
        mixCtx = new AudioContext();
      }
      mixCtxRef.current = mixCtx;

      try {
        const tabStream = await navigator.mediaDevices.getDisplayMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: true,
        });
        /* Discard video track immediately — we only need audio */
        tabStream.getVideoTracks().forEach((t) => t.stop());

        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: { ideal: TARGET_SAMPLE_RATE },
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        const micSource = mixCtx.createMediaStreamSource(micStream);
        const tabSource = mixCtx.createMediaStreamSource(tabStream);
        const dest = mixCtx.createMediaStreamDestination();
        micSource.connect(dest);
        tabSource.connect(dest);
        mixedStream = dest.stream;
      } catch (err: any) {
        mixCtxRef.current?.close();
        mixCtxRef.current = null;
        if (err.name === "NotAllowedError") {
          toast.error("A Browser tab must be selected to start Telehealth session.");
        } else {
          toast.error("Failed to capture tab audio.");
        }
        return; // abort — don't open WS
      }
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
          capture.start(ws, mixedStream).catch((err) => {
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
      mixCtxRef.current?.close();
      mixCtxRef.current = null;
      wsRef.current = null;
    };

    ws.onerror = () => {
      setStatus("idle");
      setRecording(false);
      setRecordingSessionId(null);
      captureRef.current?.stop();
      captureRef.current = null;
      mixCtxRef.current?.close();
      mixCtxRef.current = null;
      wsRef.current = null;
    };
  }, [sessionId, setStatus, setRecording, setRecordingSessionId, addLiveChunk, appendPendingChunk, baseDuration, audioSource]);

  const disconnect = useCallback(() => {
    captureRef.current?.stop();
    captureRef.current = null;
    mixCtxRef.current?.close();
    mixCtxRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    setRecordingSessionId(null);
  }, [setRecordingSessionId]);

  useEffect(() => {
    return () => {
      disconnect();
      reset();
    };
  }, [disconnect, reset]);

  return { connect, disconnect };
}

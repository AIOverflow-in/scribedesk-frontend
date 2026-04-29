"use client";

import { useEffect, useRef, useCallback } from "react";
import { getWsToken } from "@/lib/ws-token";
import { useScribeStore } from "../stores/scribe-store";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/v1/ws/scribe";

export function useScribeWs(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const {
    setStatus,
    setRecording,
    addLiveChunk,
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

    const ws = new WebSocket(`${WS_BASE}/${sessionId}?token=${token}`);

    ws.onopen = () => {
      setStatus("listening");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ready") {
          setRecording(true, data.accumulated_seconds ?? baseDuration);
        } else if (data.type === "transcript") {
          addLiveChunk(data.text, data.timestamp);
        }
      } catch {
        // Not JSON, ignore
      }
    };

    ws.onclose = () => {
      setStatus("stopped");
      setRecording(false);
      cleanup();
      wsRef.current = null;
    };

    ws.onerror = () => {
      setStatus("idle");
      setRecording(false);
      cleanup();
    };

    wsRef.current = ws;

    // Start PCM capture
    setTimeout(() => startPcmCapture(ws), 300);
  }, [sessionId, setStatus, setRecording, addLiveChunk, baseDuration]);

  const startPcmCapture = async (ws: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      await audioCtx.resume();

      const nativeRate = audioCtx.sampleRate;
      console.log(`[WS] Audio context rate: ${nativeRate}Hz, target: 16000Hz`);

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);

      // Connect through a silent gain node to keep the audio graph alive
      // (ScriptProcessorNode may not fire callbacks without a destination)
      const gain = audioCtx.createGain();
      gain.gain.value = 0;
      source.connect(processor);
      processor.connect(gain);
      gain.connect(audioCtx.destination);

      processor.onaudioprocess = (event) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        const input = event.inputBuffer.getChannelData(0);

        // Downsample native rate → 16000Hz
        const ratio = nativeRate / 16000;
        const targetLen = Math.floor(input.length / ratio);
        const output = new Float32Array(targetLen);
        for (let i = 0; i < targetLen; i++) {
          output[i] = input[Math.floor(i * ratio)];
        }

        // Float32 → Int16 PCM
        const pcm = new Int16Array(output.length);
        for (let i = 0; i < output.length; i++) {
          const s = Math.max(-1, Math.min(1, output[i]));
          pcm[i] = s * 0x7fff;
        }
        ws.send(pcm.buffer);
      };

      processorRef.current = processor;
    } catch (err) {
      console.error("Mic access denied:", err);
      ws.close();
    }
  };

  const cleanup = () => {
    processorRef.current?.disconnect();
    processorRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const disconnect = useCallback(() => {
    cleanup();
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
      reset();
    };
  }, [disconnect, reset]);

  return { connect, disconnect };
}

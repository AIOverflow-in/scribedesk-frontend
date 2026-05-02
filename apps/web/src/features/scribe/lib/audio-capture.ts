/**
 * Robust real-time audio capture for speech transcription.
 *
 * Replaces the deprecated ScriptProcessorNode with AudioWorklet for
 * reliable, non-blocking audio processing. Handles sample-rate mismatches
 * via built-in browser resampling or a custom IIR-filtered linear
 * interpolator in the worklet.
 *
 * Features:
 * - AudioWorklet for jitter-free callbacks
 * - Explicit 16 kHz capture request (browser resamples if needed)
 * - Anti-aliasing IIR low-pass filter before downsampling
 * - WebSocket backpressure detection (drops chunks rather than backing up)
 * - Proper resource cleanup
 */

export const TARGET_SAMPLE_RATE = 16000
const CHUNK_DURATION_MS = 100 // 100 ms chunks — Deepgram sweet spot
const CHUNK_SAMPLES = (TARGET_SAMPLE_RATE * CHUNK_DURATION_MS) / 1000 // 1 600 samples

/* ------------------------------------------------------------------ */
/* Inline AudioWorklet processor                                       */
/* ------------------------------------------------------------------ */

const WORKLET_CODE = `
class PcmEncoderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = options.processorOptions || {};
    this.sourceRate = opts.sourceRate || 48000;
    this.targetRate = opts.targetRate || 16000;
    this.chunkSamples = opts.chunkSamples || 1600;

    this.inputBuffer = [];
    this.phase = 0;
    this.ratio = this.sourceRate / this.targetRate;

    /* First-order IIR low-pass (anti-aliasing) */
    const cutoff = this.targetRate / 2;
    this.alpha = 1 - Math.exp(-2 * Math.PI * cutoff / this.sourceRate);
    this.filterState = 0;

    this.outputBuffer = new Float32Array(this.chunkSamples);
    this.outputIndex = 0;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    if (!input || !input[0]) {
      this._outputSilence(outputs);
      return true;
    }

    const channel = input[0];

    /* 1. Filter + buffer input samples */
    for (let i = 0; i < channel.length; i++) {
      this.filterState += this.alpha * (channel[i] - this.filterState);
      this.inputBuffer.push(this.filterState);
    }

    /* 2. Resample with linear interpolation */
    while (this.inputBuffer.length > 1) {
      const idx = Math.floor(this.phase);
      if (idx >= this.inputBuffer.length - 1) break;

      const frac = this.phase - idx;
      const s0 = this.inputBuffer[idx];
      const s1 = this.inputBuffer[idx + 1];
      this.outputBuffer[this.outputIndex++] = s0 + frac * (s1 - s0);

      if (this.outputIndex >= this.chunkSamples) {
        this._flush();
        this.outputIndex = 0;
      }

      this.phase += this.ratio;
    }

    /* 3. Discard consumed input */
    const consumed = Math.max(0, Math.floor(this.phase));
    if (consumed > 0) {
      this.inputBuffer = this.inputBuffer.slice(consumed);
      this.phase -= consumed;
    }

    this._outputSilence(outputs);
    return true;
  }

  _flush() {
    const int16 = new Int16Array(this.chunkSamples);
    for (let i = 0; i < this.chunkSamples; i++) {
      const s = Math.max(-1, Math.min(1, this.outputBuffer[i]));
      int16[i] = s < 0 ? Math.ceil(s * 0x8000) : Math.floor(s * 0x7FFF);
    }
    this.port.postMessage({ type: "pcm", data: int16 });
  }

  _outputSilence(outputs) {
    for (let i = 0; i < outputs.length; i++) {
      for (let j = 0; j < outputs[i].length; j++) {
        outputs[i][j].fill(0);
      }
    }
  }
}

registerProcessor("pcm-encoder", PcmEncoderProcessor);
`;

/* ------------------------------------------------------------------ */
/* AudioCapture class                                                  */
/* ------------------------------------------------------------------ */

export class AudioCapture {
  private ws: WebSocket | null = null;
  private audioCtx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning = false;
  private isStarting = false;
  private abortController = new AbortController();

  get running() {
    return this.isRunning;
  }

  /**
   * Start capturing microphone audio and streaming it to the given WebSocket.
   * Waits for the WebSocket to be OPEN before beginning capture.
   *
   * If `stream` is provided, skips getUserMedia and uses the given stream directly
   * (e.g. for telehealth mixed audio).
   */
  async start(ws: WebSocket, stream?: MediaStream): Promise<void> {
    if (this.isRunning || this.isStarting) {
      console.warn("[AudioCapture] Already running");
      return;
    }
    this.isStarting = true;

    this.ws = ws;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      /* 1. Acquire microphone (request 16 kHz ideal) unless stream is provided */
      if (stream) {
        this.stream = stream;
        console.log("[AudioCapture] Using provided stream");
      } else {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: { ideal: TARGET_SAMPLE_RATE },
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      }

      if (signal.aborted) throw new Error("Capture aborted");

      const track = this.stream.getAudioTracks()[0];
      const trackSettings = track.getSettings();
      const sourceRate = trackSettings.sampleRate || 48000;
      console.log(`[AudioCapture] Source sample rate: ${sourceRate}Hz`);

      /* 2. AudioContext at 16 kHz — browser resamples internally if needed */
      try {
        this.audioCtx = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE });
      } catch {
        console.warn("[AudioCapture] Defaulting to native AudioContext sample rate");
        this.audioCtx = new AudioContext();
      }

      if (signal.aborted) throw new Error("Capture aborted");
      await this.audioCtx.resume();

      const ctxRate = this.audioCtx.sampleRate;
      console.log(`[AudioCapture] AudioContext rate: ${ctxRate}Hz`);

      /* 3. Load AudioWorklet from inline Blob */
      const blob = new Blob([WORKLET_CODE], { type: "application/javascript" });
      const workletUrl = URL.createObjectURL(blob);
      await this.audioCtx.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl);

      if (signal.aborted) throw new Error("Capture aborted");

      /* 4. Build graph: source -> worklet -> gain(0) -> destination */
      this.sourceNode = this.audioCtx.createMediaStreamSource(this.stream);
      this.workletNode = new AudioWorkletNode(this.audioCtx, "pcm-encoder", {
        processorOptions: {
          sourceRate: ctxRate,
          targetRate: ctxRate,
          chunkSamples: CHUNK_SAMPLES,
        },
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
      });

      let chunksSent = 0;
      let bytesSent = 0;
      const statsInterval = setInterval(() => {
        if (!this.isRunning) {
          clearInterval(statsInterval);
          return;
        }
        console.log(
          `[AudioCapture] chunks=${chunksSent} bytes=${bytesSent} wsBuffered=${this.ws?.bufferedAmount ?? 0}`
        );
      }, 2000);

      this.workletNode.port.onmessage = (e) => {
        if (signal.aborted) return;
        if (e.data.type !== "pcm" || this.ws?.readyState !== WebSocket.OPEN) return;

        /* Backpressure: drop rather than flood the socket */
        if (this.ws.bufferedAmount > 32768) {
          console.warn(`[AudioCapture] WS backpressure ${this.ws.bufferedAmount}, dropping chunk`);
          return;
        }

        const pcm = e.data.data as Int16Array;
        const buf = pcm.buffer;
        this.ws.send(buf);
        chunksSent++;
        bytesSent += buf.byteLength;

        if (chunksSent <= 3 || chunksSent % 10 === 0) {
          console.log(
            `[AudioCapture] Sent chunk #${chunksSent} (${buf.byteLength} bytes)`
          );
        }
      };

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 0;

      this.sourceNode.connect(this.workletNode);
      this.workletNode.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.isRunning = true;
      console.log("[AudioCapture] Started");
    } catch (err) {
      this._cleanup();
      throw err;
    } finally {
      this.isStarting = false;
    }
  }

  /**
   * Immediately stop capture and release all resources.
   */
  stop(): void {
    if (!this.isRunning && !this.isStarting) return;
    this.abortController.abort();
    this._cleanup();
    this.isRunning = false;
    this.isStarting = false;
    console.log("[AudioCapture] Stopped");
  }

  private _cleanup(): void {
    try { this.workletNode?.disconnect(); } catch { /* already disconnected */ }
    try { this.sourceNode?.disconnect(); } catch {}
    try { this.gainNode?.disconnect(); } catch {}
    try { this.audioCtx?.close(); } catch {}
    this.stream?.getTracks().forEach((t) => t.stop());

    this.workletNode = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.audioCtx = null;
    this.stream = null;
    this.ws = null;
  }
}

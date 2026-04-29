import { wsEventSchema, type WsReady, type WsTranscript } from "@workspace/schemas/session";

export interface ScribeWsManagerConfig {
  baseUrl: string;
  sessionId: string;
  token: string;
}

type TranscriptHandler = (data: WsTranscript) => void;
type ReadyHandler = (data: WsReady) => void;
type CloseHandler = () => void;

export class ScribeWsManager {
  private url: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isIntentionallyClosed = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private onReadyHandlers: ReadyHandler[] = [];
  private onTranscriptHandlers: TranscriptHandler[] = [];
  private onCloseHandlers: CloseHandler[] = [];

  constructor(config: ScribeWsManagerConfig) {
    this.url = config.baseUrl.replace(/^http/, "ws").replace(/\/$/, "") + `/ws/scribe/${config.sessionId}?token=${config.token}`;
  }

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.isIntentionallyClosed = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[ScribeWS] Connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.ws.onclose = (event) => {
      console.log(`[ScribeWS] Disconnected (Code: ${event.code})`);
      this.ws = null;
      this.onCloseHandlers.forEach((h) => h());

      if (this.isIntentionallyClosed || event.code === 1008) return;
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("[ScribeWS] Connection error:", error);
    };
  }

  public disconnect() {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, "User disconnected");
      }
      this.ws = null;
    }
  }

  public sendAudio(data: ArrayBuffer | Blob) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn("[ScribeWS] Max reconnect attempts reached");
      return;
    }

    const timeout = Math.pow(2, this.reconnectAttempts) * 1000;
    this.reconnectAttempts++;

    console.log(`[ScribeWS] Reconnecting in ${timeout}ms...`);
    this.reconnectTimer = setTimeout(() => this.connect(), timeout);
  }

  private handleMessage(rawMessage: string) {
    try {
      const json = JSON.parse(rawMessage);
      const parsed = wsEventSchema.safeParse(json);

      if (!parsed.success) {
        console.warn("[ScribeWS] Malformed event:", parsed.error);
        return;
      }

      const { type, ...data } = parsed.data;

      if (type === "ready") {
        this.onReadyHandlers.forEach((h) => h(data as WsReady));
      } else if (type === "transcript") {
        this.onTranscriptHandlers.forEach((h) => h(data as WsTranscript));
      }
    } catch (err) {
      console.error("[ScribeWS] Failed to parse message:", err);
    }
  }

  public onReady(handler: ReadyHandler): () => void {
    this.onReadyHandlers.push(handler);
    return () => {
      this.onReadyHandlers = this.onReadyHandlers.filter((h) => h !== handler);
    };
  }

  public onTranscript(handler: TranscriptHandler): () => void {
    this.onTranscriptHandlers.push(handler);
    return () => {
      this.onTranscriptHandlers = this.onTranscriptHandlers.filter((h) => h !== handler);
    };
  }

  public onClose(handler: CloseHandler): () => void {
    this.onCloseHandlers.push(handler);
    return () => {
      this.onCloseHandlers = this.onCloseHandlers.filter((h) => h !== handler);
    };
  }
}

export function createScribeWsManager(config: ScribeWsManagerConfig) {
  return new ScribeWsManager(config);
}
# Scribe Feature Architecture: The Clinical Cockpit

## Overview
The Scribe feature is a modular, action-oriented "Clinical Cockpit" designed to handle the entire lifecycle of a patient consultation—from real-time speech-to-text to automated clinical documentation and decision support.

## 1. Core Modules

### 1.1 Scribe Engine (Streaming)
- **Technology:** WebSockets + Deepgram (or similar).
- **Functionality:** 
  - Supports multiple audio sources: `Local Microphone` (Physical) or `WebRTC Stream` (Telehealth).
  - Uses `useScribeSession` hook to manage WS lifecycle and buffered state.
  - UI shows "Live Transcript" with latency-optimized chunking.

### 1.2 Telehealth Bridge
- **Technology:** Agora / Twilio / Daily.co.
- **Functionality:**
  - One-click URL generation for patients (No-login guest access).
  - SMS/Email invite integration.
  - Embedded UI with "Cinema Mode" (Maximize) and "Cockpit Mode" (Side-panel/PIP).
  - Direct audio-feed injection into the Scribe Engine.

### 1.3 Document Orchestrator
- **Workflow:** 
  1. **Selection:** Modal for document type (Notes, Letters, Prescriptions).
  2. **Context Input:** Prompt engineering layer ("Focus on X").
  3. **Generation:** AI-driven drafting with "Generating..." state in the Right Sheet.
  4. **Editing:** Rich-text editing via a Lexical-based "Clinical Editor."

### 1.4 Clinical Editor (Paper Layout)
- **UI:** A4-ratio "Paper" container with fixed Header (Clinic Logo) and Footer.
- **Modularity:** Type-specific editors (e.g., Prescription Builder with Medical API search).
- **Signature System:** 
  - **Visual:** Transparent PNG signature overlay.
  - **Digital:** SHA-256 Content Hashing + Timestamp + Audit Trail.
  - **State:** Locked/Read-only once signed.

### 1.5 Clinical Decision Support (Thinking Board)
- **Functionality:** Background polling/SSE route that analyzes the transcript for:
  - Safety & Red Flags
  - Missing Data/Gaps in History
  - Differential Diagnoses
  - Medicolegal risks.
- **UI:** A dedicated pluggable tab in the Scribe Detail view.

### 1.6 AI Sidecar (Contextual Assistant)
- **UI:** Toggleable Right Sidebar.
- **Context:** Aware of current transcript, summary, and attached patient files.
- **Widgets:** In-line tools for ICD-10 Coding, Clinical Calculators (BMI, GFR), and Differential Likelihoods.

### 1.7 Longitudinal History (Graph Timeline)
- **Technology:** Neo4j/Graph-based backend.
- **UI:** Chronological vertical timeline of all consultations.
- **Functionality:** 
  - "Current" tag for active sessions.
  - "Peeks" (Expandable AI Summaries) to quickly catch up on history.
  - "Deep Dives" (Open past visits in new browser tabs).

## 2. State Management Strategy

### 2.1 ScribeStore (Zustand)
Manages the "Live" ephemeral state:
- WebSocket connection status.
- Real-time audio levels.
- Live transcript buffer (not yet saved to DB).
- Active audio source (Mic vs WebRTC).

### 2.2 DocumentStore (Context/Zustand)
Manages the "Drafting" state:
- Active document being edited in the Sheet.
- Dirty states for Lexical editor.
- Signature/Lock status.

### 2.3 UIStore (Zustand)
Manages the layout:
- Sidebar/Sidecar toggle states.
- Active tab in ScribeDetail.
- Modal/Sheet visibility.

## 3. Directory Structure
```text
features/scribe/
├── components/
│   ├── scribe-detail/         # Main layout components
│   ├── scribe-list/           # Sidebar list components
│   ├── editors/               # Lexical wrappers, Rx Builders
│   ├── telehealth/            # WebRTC components
│   ├── sidecar/               # AI Assistant & Widgets
│   ├── timeline/              # History timeline components
│   └── shared/                # Status badges, Patient cards
├── context/
│   └── scribe-context.tsx     # Unified provider for session state
├── hooks/
│   ├── use-scribe-session.ts  # WS logic
│   ├── use-scribe-actions.ts  # Document generation logic
│   └── use-clinical-data.ts   # Medical API integrations
├── stores/
│   └── scribe-store.ts        # Zustand stores
└── types/
    ├── consultation.ts
    ├── documents.ts           # Discriminated unions for Doc types
    └── telehealth.ts
```

## 4. Multi-Page PDF Strategy
- **Web UI:** Continuous scroll "Paper" layout for editing.
- **PDF Export:** Use `react-pdf` or server-side Puppeteer to generate true multi-page documents with repeating headers, footers, and page numbers ("Page X of Y").

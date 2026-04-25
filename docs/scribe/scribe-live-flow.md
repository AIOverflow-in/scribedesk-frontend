# Scribe Live Session & Usage Architecture

## 1. The Session Lifecycle

### 1.1 Initiation (The "ID First" Pattern)
1. **Trigger:** User clicks "New Session" in Sidebar.
2. **Action:** Frontend hits `POST /consultations`. 
3. **Backend:** Creates a shell record in the database.
4. **Redirect:** Frontend redirects to `/scribe/:id`.
5. **UI State:** Start button is enabled; Create button is disabled (if no session exists yet).

### 1.2 The Recording Flow (Active Segments)
1. **Start/Resume:** 
   - Frontend opens WebSocket to `ws://backend/scribe/:id`.
   - Backend sends `SYNC_PACKET`: `{ accumulated_seconds: X, status: 'listening' }`.
   - **Timer Start:** Frontend timer starts counting ONLY after receiving this packet.
2. **Streaming:**
   - Backend buffers 4-5 `speech_final` chunks.
   - Backend calculates `RelativeTimestamp = AccumulatedDuration + (CurrentTime - SegmentStartTime)`.
   - Backend pushes chunk to Frontend: `{ text: "...", timestamp: 145 }`.
3. **Pause/Stop:**
   - Frontend hits `POST /consultations/:id/pause`.
   - Backend stops the segment, calculates duration, and **logs usage** (see Section 2).
   - Frontend invalidates TanStack Query; UI "snaps" to the latest backend duration.

## 2. Usage & Billing Integrity

### 2.1 The Usage Ledger (`scribe_usage_logs`)
To ensure accurate billing across time periods, we use an immutable ledger rather than just the consultation's total duration.

**Schema:**
- `user_id`: The doctor/org consuming the minutes.
- `consultation_id`: Reference to the specific session.
- `seconds`: The duration of the specific segment just completed.
- `created_at`: The timestamp of the activity.

### 2.2 Accidental Disconnect (The "Soft Pause")
- **Detection:** If the WS connection is lost (browser refresh/crash), the Go backend's `defer` or `OnClose` handler triggers.
- **Logic:** It treats the disconnect as a "Pause" event, saves the current segment to `scribe_usage_logs`, and updates the consultation status to `paused`.
- **Recovery:** Upon refresh, the UI fetches the consultation details, sees the total duration, and shows the "Resume" button.

## 3. Frontend Timer Logic (Independent Calculation)

The timer in the `ScribeStore` (Zustand) is a **Slave to the State**, not a standalone counter.

**Formula:**
`DisplayTime = baseDuration + (isRecording ? (currentTime - startTime) : 0)`

- **`baseDuration`**: The total duration from the last DB sync (Consultation object).
- **`startTime`**: Set to `Date.now()` when the WS `SYNC_PACKET` is received.
- **`isRecording`**: Controlled by WS connection status.

## 4. Navigation & Persistence
- **SPA Navigation:** Since the `ScribeStore` is a global JavaScript object, the timer and WebSocket connection remain active if the user navigates to other internal pages (e.g., Settings, Templates).
- **UI Indicator:** A global "Active Session" indicator (red dot) is rendered in the Sidebar by subscribing to the `ScribeStore`.

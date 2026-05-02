"use client"

import { useCallback, useEffect } from "react"
import { useScribeSession } from "../context/scribe-session-provider"

export function useScribeWs(sessionId: string | null) {
  const { connect: ctxConnect, disconnect } = useScribeSession()

  const connect = useCallback(() => {
    if (!sessionId) return
    ctxConnect(sessionId)
  }, [sessionId, ctxConnect])

  // On mount, restore recording state from store if WS is already connected
  // On unmount, do NOT disconnect — provider manages lifecycle across pages
  useEffect(() => {
    return () => {
      // provider survives page changes — no cleanup here
    }
  }, [])

  return { connect, disconnect }
}

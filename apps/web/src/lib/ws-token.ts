let wsToken: string | null = null

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem("ws_token")
  } catch {
    return null
  }
}

export function getWsToken() {
  if (wsToken === null) {
    wsToken = getStoredToken()
  }
  return wsToken
}

export function setWsToken(token: string | null) {
  wsToken = token
  if (typeof window === "undefined") return
  try {
    if (token) {
      localStorage.setItem("ws_token", token)
    } else {
      localStorage.removeItem("ws_token")
    }
  } catch {
    // localStorage unavailable
  }
}

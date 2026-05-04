/// <reference types="vite/client" />

interface google {
  accounts: {
    id: {
      initialize(config: {
        client_id: string
        callback: (response: { credential?: string }) => void
      }): void
      prompt(): void
      cancel(): void
    }
    oauth2: {
      initTokenClient(config: {
        client_id: string
        scope: string
        prompt?: string
        callback: (response: { access_token?: string; error?: string }) => void
      }): {
        requestAccessToken: () => void
      }
    }
  }
}

declare var google: google | undefined

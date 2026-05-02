import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { AppLayout } from "@/shared/layout/app-layout"
import { useAuth } from "@/contexts/AuthContext"
import { ScribeSessionProvider } from "@/features/scribe/context/scribe-session-provider"

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
  beforeLoad: ({ location }) => {
    const isAuthPath = location.href.includes("/login") || location.href.includes("/register")
    if (!isAuthPath) {
      return { requiresAuth: true }
    }
  },
})

function ProtectedLayout() {
  const { isLoading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ScribeSessionProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ScribeSessionProvider>
  )
}

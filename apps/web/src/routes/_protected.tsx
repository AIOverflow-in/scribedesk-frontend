import { createFileRoute, Outlet } from "@tanstack/react-router"
import { AppLayout } from "@/shared/layout/app-layout"

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

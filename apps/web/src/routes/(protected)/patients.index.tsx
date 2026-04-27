import { createFileRoute } from "@tanstack/react-router"
import { PatientsPage } from "@workspace/features/patients/pages/patients-page"

export const Route = createFileRoute("/(protected)/patients/")({
  component: PatientsRoute,
})

function PatientsRoute() {
  return <PatientsPage />
}

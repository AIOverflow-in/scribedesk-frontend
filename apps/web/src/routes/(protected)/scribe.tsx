import { createFileRoute } from "@tanstack/react-router"
import { ScribePage } from "@workspace/features/scribe/pages"

export const Route = createFileRoute("/(protected)/scribe")({
  component: ScribeRoute,
})

function ScribeRoute() {
  return <ScribePage />
}

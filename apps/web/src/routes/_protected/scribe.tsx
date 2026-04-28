import { createFileRoute } from "@tanstack/react-router"
import { ScribePage } from "@workspace/features/scribe/pages"
import { z } from "zod"

const scribeSearchSchema = z.object({
  id: z.string().optional(),
})

type ScribeSearch = z.infer<typeof scribeSearchSchema>

export const Route = createFileRoute("/_protected/scribe")({
  validateSearch: (search: Record<string, unknown>): ScribeSearch => 
    scribeSearchSchema.parse(search),
  component: ScribeRoute,
})

function ScribeRoute() {
  return <ScribePage />
}

import { createFileRoute } from '@tanstack/react-router'
import { TemplatesPage } from '@/features/templates/pages/templates-page'

export const Route = createFileRoute('/_protected/templates/')({
  component: TemplatesPage,
})

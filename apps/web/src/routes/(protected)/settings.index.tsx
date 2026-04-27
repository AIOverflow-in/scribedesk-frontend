import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/features/user/pages/settings-page'

export const Route = createFileRoute('/(protected)/settings/')({
  component: SettingsPage,
})

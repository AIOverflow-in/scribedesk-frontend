import { createFileRoute } from '@tanstack/react-router'
import OnboardingPage from '@/features/auth/pages/onboarding-page'

export const Route = createFileRoute('/(auth)/onboarding')({
  component: OnboardingPage,
})

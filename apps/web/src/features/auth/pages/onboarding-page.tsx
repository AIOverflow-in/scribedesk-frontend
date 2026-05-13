import { OnboardingForm } from "../components/onboarding-form"
import { AuthLayout } from "../components/auth-layout"
import { useAuth } from "@/contexts/AuthContext"

export default function OnboardingPage() {
  const { logout } = useAuth()

  return (
    <AuthLayout>
      <div className="flex w-full max-w-xs flex-col items-center">
        <OnboardingForm />
        <p className="mt-8 text-sm text-muted-foreground">
          Not your account?{" "}
          <button type="button" onClick={logout} className="underline underline-offset-4">
            Logout
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}

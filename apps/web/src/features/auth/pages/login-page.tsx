import { LoginForm } from "../components/login-form"
import { AuthLayout } from "../components/auth-layout"

export default function LoginPage() {
  return (
    <AuthLayout
      headerLink={
        <>
          New to ScribeDesk?{" "}
          <a href="/register" className="ml-2 font-bold text-foreground underline-offset-4 hover:underline">Sign up →</a>
        </>
      }
    >
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </AuthLayout>
  )
}

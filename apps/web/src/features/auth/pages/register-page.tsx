import { RegisterForm } from "../components/register-form"
import { AuthLayout } from "../components/auth-layout"

export default function RegisterPage() {
  return (
    <AuthLayout
      headerLink={
        <>
          Already have an account?{" "}
          <a href="/login" className="ml-2 font-bold text-foreground underline-offset-4 hover:underline">Sign in →</a>
        </>
      }
    >
      <div className="w-full max-w-xs">
        <RegisterForm />
      </div>
    </AuthLayout>
  )
}

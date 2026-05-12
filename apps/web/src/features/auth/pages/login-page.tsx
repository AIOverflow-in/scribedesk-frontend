import { LoginForm } from "../components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <img src="/logo/scribedesk.ico" alt="ScribeDesk" className="size-6 rounded-md" />
            ScribeDesk
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/icons/auth/login.png"
          alt="Medical professional"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

import { RegisterForm } from "../components/register-form"

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            ScribeDesk
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center gap-1 text-center mb-6">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-sm text-muted-foreground">
                Join ClinScribe and start your free trial
              </p>
            </div>
            <RegisterForm />
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

import type { ReactNode } from "react"
import { AuthBrandPanel } from "./auth-brand-panel"
import { LiveTranscript } from "./widgets"

interface AuthLayoutProps {
  children: ReactNode
  headerLink?: ReactNode
}

export function AuthLayout({ children, headerLink }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <AuthBrandPanel>
        <div className="relative w-full max-w-xl space-y-4">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Welcome to Scribe<span className="text-white/60">Desk</span>
          </h1>
          <p className="text-lg text-white/80">
            AI-powered clinical documentation with real-time SOAP notes, ICD-10 coding,
            drug-interaction checks, and patient summaries.
          </p>
        </div>
        <div className="relative mt-10 w-full max-w-xl">
          <LiveTranscript />
        </div>
        <div className="relative mt-12 w-full max-w-xl">
          <div className="border-t border-white/10 pt-6">
            <blockquote className="text-sm leading-relaxed text-white/70">
              &ldquo;I used to stay an hour after clinic finishing notes. With ScribeDesk, I&apos;m out the door with my patients.&rdquo;
            </blockquote>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
              <span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white/70">SM</span>
              <span>Dr. Sarah Mitchell &middot; GP, North London</span>
            </div>
          </div>
        </div>
      </AuthBrandPanel>
      <div className="relative flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 font-medium">
            <img src="/logo/scribedesk.ico" alt="ScribeDesk" className="size-10 rounded-md" />
            <span><span className="text-xl font-bold">Scribe</span><span className="text-xl font-normal text-muted-foreground">Desk</span></span>
          </a>
          {headerLink && (
            <p className="hidden text-base text-muted-foreground md:block">
              {headerLink}
            </p>
          )}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full flex-col items-center">
            {children}
            {headerLink && (
              <p className="mt-10 text-base text-muted-foreground md:hidden">
                {headerLink}
              </p>
            )}
          </div>
        </div>
        <p className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>&copy; 2026 ScribeDesk</span>
          <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">Privacy</a>
          <a href="/terms" className="underline underline-offset-4 hover:text-foreground">Terms</a>
        </p>
      </div>
    </div>
  )
}

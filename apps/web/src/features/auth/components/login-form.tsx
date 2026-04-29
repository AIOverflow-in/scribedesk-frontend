"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { cn } from "@workspace/ui/lib/utils"
import { useAuthLogin } from "../hooks/use-auth-flow"
import { toast } from "@workspace/ui/components/sonner"
import { Eye, EyeOff } from "lucide-react"

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [errorTimeout, setErrorTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)
  const loginMutation = useAuthLogin()

  const clearErrorsAfterDelay = () => {
    if (errorTimeout) clearTimeout(errorTimeout)
    const timeout = setTimeout(() => setErrors({}), 5000)
    setErrorTimeout(timeout)
  }

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      clearErrorsAfterDelay()
      return
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Logged in successfully")
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Invalid email or password"
          toast.error(message)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-5", className)} {...props}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrors((prev) => ({ ...prev, email: undefined }))
          }}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </Field>

      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <a
            href="#"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </Field>

      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>

      <div className="relative text-center text-sm">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
        <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t" />
      </div>

      <Button variant="outline" type="button" className="w-full">
        <img src="/icons/auth/google.png" alt="Google" className="mr-2 h-6 w-6" />
        Login with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/register" className="underline underline-offset-4">
          Sign up
        </a>
      </p>
    </form>
  )
}
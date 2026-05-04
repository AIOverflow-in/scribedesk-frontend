"use client";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "@/lib/api-client";
import { ApiError } from "@workspace/schemas/api-error";
import type { GoogleRequest, AuthResponse } from "@workspace/schemas/auth";
import { useAuth } from "@/contexts/AuthContext";
import { setWsToken } from "@/lib/ws-token";
import { toast } from "@workspace/ui/components/sonner";

export function useGoogleSignIn() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: GoogleRequest) => authApi.google(data),
    onSuccess: async (response: AuthResponse) => {
      if (response.session_token) setWsToken(response.session_token)
      await refetchUser();
      if (response.onboarding_pending) {
        navigate({ to: "/onboarding" });
      } else {
        navigate({ to: "/" });
      }
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        throw error;
      }
      throw error;
    },
  });

  const signIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      toast.error("Google login is not configured")
      return
    }

    if (typeof google === "undefined" || !google.accounts) {
      toast.error("Google Identity Services failed to load")
      return
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      prompt: "consent",
      callback: (response: { access_token?: string; error?: string }) => {
        if (response.error) {
          toast.error("Google login failed")
          return
        }
        mutation.mutate(
          { idToken: response.access_token ?? "" },
          {
            onSuccess: () => {
              toast.success("Logged in with Google")
            },
            onError: (error) => {
              if (error instanceof ApiError && error.status === 409) {
                toast.error("An account with this email already exists. Please sign in with your password, then link Google in settings.")
              } else {
                toast.error("Google login failed")
              }
            },
          }
        )
      },
    })

    client.requestAccessToken()
  }

  return { signIn, isPending: mutation.isPending }
}

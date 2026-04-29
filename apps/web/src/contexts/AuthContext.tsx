"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import type { UserResponse } from "@workspace/schemas/user";
import { createApiClient } from "@workspace/api-client";
import { ApiError } from "@workspace/schemas/api-error";
import { setWsToken } from "@/lib/ws-token";

interface AuthContextValue {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const fetchUser = async () => {
    try {
      const response = await apiClient.get<UserResponse>("/users/me");
      setUser(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
      } else {
        console.error("Failed to fetch user:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setWsToken(null);
      setUser(null);
      navigate({ to: "/login" });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, logout, refetchUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
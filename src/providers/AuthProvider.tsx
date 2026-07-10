"use client";

// Client-side authentication context. Exposes the current session state to the
// UI and the `useAuth` hook. All actual auth work (login, logout, fetching the
// current user) goes through the same-origin BFF (`/api/*`) — this provider
// never talks to the backend server or reads `document.cookie` directly.

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AuthState, User } from "@/types";

/** React Query key for the current-session lookup. */
const ME_QUERY_KEY = ["auth", "me"] as const;

/**
 * Auth context value: the current {@link AuthState} plus session actions.
 * `login` is a full-page navigation (the OAuth flow requires a browser
 * redirect), so it is intentionally not exposed here.
 */
export interface AuthContextValue extends AuthState {
  /** Clear the session via the BFF and reset local auth state. */
  logout: () => Promise<void>;
  /** Re-fetch the current user from `/api/auth/me`. */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provide authentication state to descendants. Bootstraps the session on mount
 * by querying `/api/auth/me`; a 401 resolves to an unauthenticated state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<User | null>({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient<{ user: User }>("/api/auth/me");
      if (!response.ok) {
        if (response.error.status === 401) {
          return null;
        }
        throw new Error(response.error.message);
      }
      return response.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    await apiClient("/api/auth/logout", { method: "POST" });
    queryClient.setQueryData(ME_QUERY_KEY, null);
  }, [queryClient]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
  }, [queryClient]);

  const user = data ?? null;
  const value: AuthContextValue = {
    user,
    status: isLoading
      ? "loading"
      : user
        ? "authenticated"
        : "unauthenticated",
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Access the current auth context.
 *
 * @returns The {@link AuthContextValue}.
 * @throws If called outside of an {@link AuthProvider}.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

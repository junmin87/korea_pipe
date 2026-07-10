"use client";

// Client-side authentication context. Exposes the current session state to the
// UI and the `useAuth` hook. All actual auth work (login, logout, fetching the
// current user) goes through the same-origin BFF (`/api/*`) — this provider
// never talks to the backend server or reads `document.cookie` directly.

import { createContext, useContext, type ReactNode } from "react";
import type { AuthState } from "@/types";

/**
 * Auth context value. Currently just the {@link AuthState}; login/logout
 * actions will be added here during implementation.
 *
 * TODO: extend with `login`, `logout`, and `refresh` callbacks.
 */
export type AuthContextValue = AuthState;

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provide authentication state to descendants.
 *
 * @param children - Subtree that needs access to auth state.
 *
 * TODO: implement in the next session — bootstrap session from `/api/auth/me`
 * via TanStack Query, expose login/logout actions, track loading/auth status.
 * For now it provides an empty placeholder value so the tree renders.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: replace with real session state wired to the BFF.
  const value: AuthContextValue = {};

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

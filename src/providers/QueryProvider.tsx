"use client";

// Client-side TanStack Query provider. Owns a single QueryClient instance for
// the browser session and makes it available to all descendant hooks.
//
// The QueryClient is created lazily in state so it is stable across re-renders
// and never shared between requests on the server.

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Wrap the app (or a subtree) so descendants can use TanStack Query hooks.
 *
 * @param children - Subtree that needs access to the query client.
 *
 * TODO: tune default query options (staleTime, retry, refetchOnWindowFocus)
 * during the implementation session. Defaults are used for now.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  // TODO: pass a configured `defaultOptions` object once requirements are known.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

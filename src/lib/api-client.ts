// Thin fetch wrapper used by hooks to talk to the same-origin BFF layer
// (`/api/*`). This NEVER calls the backend server directly — the BFF proxies
// to the backend and owns cookies, JWTs, and rate limiting. Keep this module
// pure: no React, no state (see CLAUDE.md → Architecture Boundaries).

import type { ApiResponse } from "@/types";

/** Options accepted by {@link apiClient}, mirroring a subset of `RequestInit`. */
export interface ApiClientOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable request body; the client stringifies it. */
  body?: unknown;
}

/**
 * Perform a request against a same-origin BFF route (`/api/...`).
 *
 * Handles JSON serialization, `credentials: 'include'` for the httpOnly
 * session cookie, and normalization into an {@link ApiResponse} envelope.
 *
 * @typeParam T - Expected shape of the response payload.
 * @param path - Same-origin path beginning with `/api/`.
 * @param options - Fetch options; `body` is JSON-serialized automatically.
 * @returns The parsed {@link ApiResponse} envelope.
 *
 * TODO: implement in the next session — build fetch call, attach credentials,
 * parse JSON, map non-2xx responses to the ApiError branch, handle network
 * failures. No implementation yet.
 */
export async function apiClient<T = unknown>(
  path: string,
  options?: ApiClientOptions,
): Promise<ApiResponse<T>> {
  void path;
  void options;
  // TODO: implement
  throw new Error("apiClient: not implemented");
}

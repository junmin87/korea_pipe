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
 */
export async function apiClient<T = unknown>(
  path: string,
  options?: ApiClientOptions,
): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options ?? {};
  const hasBody = body !== undefined;

  try {
    const response = await fetch(path, {
      ...rest,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: hasBody ? JSON.stringify(body) : undefined,
    });

    // Parse the body defensively: some routes (e.g. logout) may return no
    // content, and error responses are not guaranteed to be JSON.
    const text = await response.text();
    let payload: unknown = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      const record =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>)
          : null;
      const message =
        (record && typeof record.message === "string" && record.message) ||
        (record && typeof record.error === "string" && record.error) ||
        response.statusText ||
        "Request failed";
      const code =
        record && typeof record.code === "string" ? record.code : undefined;

      return {
        ok: false,
        error: { status: response.status, message, code },
      };
    }

    return { ok: true, data: payload as T };
  } catch (error) {
    return {
      ok: false,
      error: {
        status: 0,
        message: error instanceof Error ? error.message : "Network error",
      },
    };
  }
}

// Server-side session cookie + JWT helpers, used exclusively by the BFF layer
// (`app/api/*`). Pure utilities: no React, no client code. The session cookie
// is httpOnly by design, so it is only ever read/written here on the server
// (see CLAUDE.md — never touch `document.cookie` from the client).
//
// Backing env vars (see .env.example): JWT_SECRET, BACKEND_URL.

import type { SessionClaims } from "@/types";

/** Name of the httpOnly cookie that stores the session JWT. */
export const SESSION_COOKIE_NAME = "hk_session";

/**
 * Verify and decode a session JWT.
 *
 * @param token - The raw JWT string extracted from the session cookie.
 * @returns The decoded {@link SessionClaims} when valid, or `null` otherwise.
 *
 * TODO: implement with `jsonwebtoken.verify` using `process.env.JWT_SECRET`.
 * Return null on any verification error (expired, malformed, bad signature).
 * No implementation yet.
 */
export function verifySessionToken(token: string): SessionClaims | null {
  void token;
  // TODO: implement
  throw new Error("verifySessionToken: not implemented");
}

/**
 * Sign a new session JWT for the given claims.
 *
 * @param claims - Claims to embed in the token payload.
 * @returns A signed JWT string.
 *
 * TODO: implement with `jsonwebtoken.sign` using `process.env.JWT_SECRET`
 * and an appropriate expiry. No implementation yet.
 */
export function signSessionToken(claims: SessionClaims): string {
  void claims;
  // TODO: implement
  throw new Error("signSessionToken: not implemented");
}

/**
 * Read the session JWT from the incoming request's httpOnly cookie.
 *
 * @returns The raw token string, or `null` when no session cookie is present.
 *
 * TODO: implement using `next/headers` cookies() in the App Router. No
 * implementation yet.
 */
export async function getSessionToken(): Promise<string | null> {
  // TODO: implement
  throw new Error("getSessionToken: not implemented");
}

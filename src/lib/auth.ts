// Server-side session cookie + JWT helpers, used exclusively by the BFF layer
// (`app/api/*`). Pure utilities: no React, no client code. The session cookie
// is httpOnly by design, so it is only ever read/written here on the server
// (see CLAUDE.md — never touch `document.cookie` from the client).
//
// Backing env vars (see .env.example): JWT_SECRET, SESSION_COOKIE_NAME.

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { SessionClaims } from "@/types";

/** Name of the httpOnly cookie that stores the session JWT. */
export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "hikorea_session";

/**
 * Name of the short-lived httpOnly cookie holding the OAuth `state` value.
 * Set when redirecting to Google and consumed once in the callback for CSRF
 * protection.
 */
export const OAUTH_STATE_COOKIE_NAME = "hk_oauth_state";

/** Default lifetime (in seconds) for a freshly signed session token: 7 days. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

/**
 * Verify and decode a session JWT.
 *
 * @param token - The raw JWT string extracted from the session cookie.
 * @returns The decoded {@link SessionClaims} when valid, or `null` otherwise
 *   (expired, malformed, or bad signature).
 */
export function verifySessionToken(token: string): SessionClaims | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string") {
      return null;
    }
    return decoded as SessionClaims;
  } catch {
    return null;
  }
}

/**
 * Sign a new session JWT for the given claims.
 *
 * @param claims - Claims to embed in the token payload.
 * @returns A signed JWT string valid for {@link SESSION_MAX_AGE_SECONDS}.
 */
export function signSessionToken(claims: SessionClaims): string {
  // Strip signer-managed fields so `expiresIn` is not rejected by jsonwebtoken.
  const { iat: _iat, exp: _exp, ...payload } = claims;
  void _iat;
  void _exp;
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Read the session JWT from the incoming request's httpOnly cookie.
 *
 * @returns The raw token string, or `null` when no session cookie is present.
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

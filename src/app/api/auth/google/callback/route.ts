// BFF route: completes the Google OAuth flow.
//
// Google redirects here with `code` and `state`. We verify `state` against the
// cookie set in the start route (CSRF defense), exchange the `code` with our
// backend for a session token, store that token in an httpOnly cookie, and
// redirect the user home. The backend URL and token never reach the client.

import { NextResponse, type NextRequest } from "next/server";
import {
  OAUTH_STATE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";

/** Redirect to /login with an error flag, clearing the transient state cookie. */
function loginError(request: NextRequest, reason: string): NextResponse {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", reason);
  const response = NextResponse.redirect(url);
  response.cookies.delete(OAUTH_STATE_COOKIE_NAME);
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    return loginError(request, oauthError);
  }

  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value;

  // CSRF check: reject unless the returned state matches the cookie exactly.
  if (!state || !expectedState || state !== expectedState) {
    return loginError(request, "state_mismatch");
  }

  if (!code) {
    return loginError(request, "missing_code");
  }

  const backendUrl = process.env.BACKEND_URL;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!backendUrl || !redirectUri) {
    return loginError(request, "server_config");
  }

  let serverToken: string | null = null;
  try {
    const backendResponse = await fetch(`${backendUrl}/google/web-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code, redirectUri }),
    });

    if (!backendResponse.ok) {
      return loginError(request, "backend_rejected");
    }

    const data = (await backendResponse.json()) as Record<string, unknown>;
    const token = data.serverToken ?? data.token ?? data.accessToken;
    if (typeof token === "string" && token.length > 0) {
      serverToken = token;
    }
  } catch {
    return loginError(request, "backend_unreachable");
  }

  if (!serverToken) {
    return loginError(request, "no_token");
  }

  const response = NextResponse.redirect(new URL("/", request.url));

  // Persist the session as an httpOnly cookie; clear the one-time state cookie.
  response.cookies.set(SESSION_COOKIE_NAME, serverToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  response.cookies.delete(OAUTH_STATE_COOKIE_NAME);

  return response;
}

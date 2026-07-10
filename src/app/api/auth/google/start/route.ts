// BFF route: begins the Google OAuth flow.
//
// Generates a random CSRF `state`, stores it in a short-lived httpOnly cookie,
// and redirects the browser to Google's consent screen. The matching callback
// route verifies the `state` before trusting the returned `code`.

import { NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE_NAME } from "@/lib/auth";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { message: "Google OAuth is not configured" },
      { status: 500 },
    );
  }

  // Random, unguessable value bound to this browser via the cookie below.
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  const response = NextResponse.redirect(
    `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`,
  );

  response.cookies.set(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes to complete consent
  });

  return response;
}

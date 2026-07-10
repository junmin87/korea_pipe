// BFF route: returns the current user for the session cookie, or 401.
//
// Verifies the httpOnly session token locally (shared JWT secret) and maps its
// claims to the client-facing `User` shape. Never exposes the raw token.

import { NextResponse } from "next/server";
import { getSessionToken, verifySessionToken } from "@/lib/auth";
import type { User } from "@/types";

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const claims = verifySessionToken(token);
  if (!claims) {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }

  // const id = claims.sub ?? claims.id;
  const id = claims.sub ?? claims.id ?? claims.userId;

  const { email, name, picture } = claims;
  if (typeof id !== "string" || typeof email !== "string") {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }

  const user: User = {
    id,
    email,
    ...(typeof name === "string" ? { name } : {}),
    ...(typeof picture === "string" ? { picture } : {}),
  };

  return NextResponse.json({ user });
}

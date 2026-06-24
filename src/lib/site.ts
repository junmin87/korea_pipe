// Canonical site URL, driven by the NEXT_PUBLIC_SITE_URL environment variable.
// Falls back to localhost for local development when the variable is unset.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

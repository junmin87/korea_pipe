// Shared domain and API types for the authenticated interactive features
// (Google login, RAG tutor chat, sentence refinement). These are consumed by
// the BFF layer (`app/api/*`), hooks, and providers.

/** An authenticated end user, as surfaced to the client by the BFF. */
export interface User {
  /** Stable unique identifier (from the session token `sub`/`id` claim). */
  id: string;
  /** Primary email address. */
  email: string;
  /** Human-readable display name, when the provider supplies one. */
  name?: string;
  /** Avatar/profile image URL, when available. */
  picture?: string;
}

/**
 * Claims embedded in the session JWT issued by the backend and stored in the
 * httpOnly session cookie. Only a subset is guaranteed; extra claims may be
 * present, so this stays intentionally open.
 */
export interface SessionClaims {
  userId: string;
  email?: string;
  name?: string;
  picture?: string;
  /** Issued-at / expiry (seconds since epoch), set by the signer. */
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/** Loading/auth lifecycle status exposed to the UI. */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/** Authentication state exposed via the AuthProvider / useAuth hook. */
export interface AuthState {
  /** The signed-in user, or `null` when unauthenticated / still loading. */
  user: User | null;
  /** Current lifecycle status of the session bootstrap. */
  status: AuthStatus;
}

/** Normalized API error surfaced to the client. */
export interface ApiError {
  /** HTTP status code (0 for network/transport failures). */
  status: number;
  /** Human-readable message. */
  message: string;
  /** Optional machine-readable error code. */
  code?: string;
}

/**
 * Envelope returned by {@link apiClient} for the BFF proxy routes. A
 * discriminated union so hooks branch on `ok` for a consistent success/error
 * shape.
 */
export type ApiResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

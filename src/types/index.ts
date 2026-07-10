// Shared domain and API types for the authenticated interactive features
// (Google login, RAG tutor chat, sentence refinement). These are consumed by
// the BFF layer (`app/api/*`), hooks, and providers.
//
// TODO: Fill these in during the implementation session. The shapes below are
// placeholders and WILL change once the backend contract is finalized.

/** An authenticated end user, as surfaced to the client by the BFF. */
export interface User {
  // TODO: id, email, displayName, avatarUrl, createdAt, ...
  [key: string]: unknown;
}

/**
 * Claims embedded in the session JWT issued by the backend.
 * TODO: align with the backend's actual token payload (sub, email, exp, iat, ...).
 */
export interface SessionClaims {
  [key: string]: unknown;
}

/** Authentication state exposed via the AuthProvider / useAuth hook. */
export interface AuthState {
  // TODO: user | null, status ('loading' | 'authenticated' | 'unauthenticated'), ...
  [key: string]: unknown;
}

/**
 * Envelope returned by the BFF proxy routes. Keeps a consistent success/error
 * shape so hooks don't each reinvent error handling.
 * TODO: finalize discriminated union (ok/data vs error) during implementation.
 */
export interface ApiResponse<T = unknown> {
  // TODO: { ok: true; data: T } | { ok: false; error: ApiError }
  data?: T;
  [key: string]: unknown;
}

/** Normalized API error surfaced to the client. */
export interface ApiError {
  // TODO: status, code, message
  message: string;
  [key: string]: unknown;
}

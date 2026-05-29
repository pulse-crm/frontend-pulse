// Access-token handling for the CAM API.
//
// All authn/authz is via Keycloak (Pulse Ground Rules I §6.1) — the console
// never builds its own identity layer. This module is the single seam where the
// app obtains the short-lived bearer token to attach to API calls; an OIDC
// integration (e.g. keycloak-js) calls `setAccessToken` after login/refresh.
//
// SECURITY: the token lives in memory by default (cleared on reload, not
// readable cross-origin). We fall back to sessionStorage (cleared when the tab
// closes) rather than localStorage, and finally to a dev-only build-time token.
// The token is a credential — it is NEVER logged.

const SESSION_KEY = "pulse-access-token";

let inMemoryToken: string | null = null;

/** Store the current access token (call after Keycloak login / silent refresh). */
export function setAccessToken(token: string | null): void {
  inMemoryToken = token;
  try {
    if (token) sessionStorage.setItem(SESSION_KEY, token);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* sessionStorage may be unavailable (private mode) — in-memory still works */
  }
}

/** Retrieve the current access token, or null if the user is not authenticated. */
export function getAccessToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
  } catch {
    /* ignore */
  }
  // Dev convenience only — never present in a production build.
  return import.meta.env.VITE_API_TOKEN ?? null;
}

/** Clear the session (logout). */
export function clearAccessToken(): void {
  setAccessToken(null);
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

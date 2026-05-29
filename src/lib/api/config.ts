// Central API configuration. All ingress goes through Kong (Pulse Ground Rules
// I §4) — the frontend talks to one base URL and never to a service directly.

/** Base URL for the CAM API. Same-origin "/api" by default so a dev proxy or
 *  an edge route in front of Kong works without rebuilds. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

/** Per-request timeout (ms). Bounded so a slow dependency degrades, never hangs
 *  (Ground Rules I §7 — degrade, not hang). */
export const REQUEST_TIMEOUT_MS = 10_000;

/** Brand context for the console (single-tenant, multi-brand — Ground Rules I §8.2). */
export const BRAND_ID = import.meta.env.VITE_BRAND_ID ?? "";

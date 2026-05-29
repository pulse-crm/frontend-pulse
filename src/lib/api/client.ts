// Core HTTP client for the CAM API. One place that enforces the cross-cutting
// request contract so no caller re-implements it:
//   • Bearer auth (Keycloak token) on every request — Ground Rules I §6.1
//   • x-correlation-id per request for end-to-end tracing — Ground Rules IV §2
//   • Idempotency-Key on creates so a retry is safe — Ground Rules II §9
//   • bounded timeout (AbortController) so the UI degrades, never hangs — I §7
//   • platform error-envelope parsing into a typed ApiError — I §4.4
//
// SECURITY: request/response bodies may contain PII and are NEVER logged. Only
// the correlationId + error code are surfaced for diagnostics.

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./config";
import { getAccessToken } from "./auth";
import { ApiError, toApiError } from "./errors";

export interface RequestOptions {
  /** Query string parameters; undefined/empty values are dropped. */
  params?: Record<string, string | number | undefined>;
  /** JSON request body (object is serialised). */
  body?: unknown;
  /** Idempotency key for unsafe creates (POST). */
  idempotencyKey?: string;
  /** Per-call timeout override (ms). */
  timeoutMs?: number;
  /** Caller-supplied abort signal (e.g. to cancel a stale search). */
  signal?: AbortSignal;
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const url = `${API_BASE_URL}${path}`;
  if (!params) return url;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

function newCorrelationId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `corr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const correlationId = newCorrelationId();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-correlation-id": correlationId,
  };

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.idempotencyKey) headers["idempotency-key"] = options.idempotencyKey;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  // Bound the request so a slow/unreachable dependency cannot hang the UI.
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), options.timeoutMs ?? REQUEST_TIMEOUT_MS);
  // Honour a caller's cancellation (stale search) alongside our timeout.
  if (options.signal) {
    if (options.signal.aborted) timeout.abort();
    else options.signal.addEventListener("abort", () => timeout.abort(), { once: true });
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, options.params), {
      method,
      headers,
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
      signal: timeout.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    const aborted = err instanceof DOMException && err.name === "AbortError";
    // A caller-initiated cancel should propagate as-is so callers can ignore it.
    if (aborted && options.signal?.aborted) throw err;
    throw new ApiError({
      code: aborted ? "TIMEOUT" : "NETWORK",
      message: aborted ? "The request timed out." : "Network request failed.",
      retryable: true,
      correlationId,
      status: 0,
    });
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const parsed = text ? safeJson(text) : undefined;

  if (!res.ok) {
    throw toApiError(res.status, parsed, correlationId);
  }
  return parsed as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, options),
  post: <T>(path: string, options?: RequestOptions) => request<T>("POST", path, options),
  patch: <T>(path: string, options?: RequestOptions) => request<T>("PATCH", path, options),
  del: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, options),
};

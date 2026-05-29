// The platform error envelope (Pulse Ground Rules I §4.4) and the typed error the
// client throws. Every CAM API failure arrives in this shape, so the UI handles
// failure uniformly and can decide to retry, fall back, or escalate.

export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_FAILED"
  | "CONFLICT"
  | "DEPENDENCY_UNAVAILABLE"
  | "RATE_LIMITED"
  | "INTERNAL"
  | "NETWORK" // client-side: request never completed (offline, CORS, timeout)
  | "TIMEOUT";

export interface ErrorEnvelope {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly retryable: boolean;
    readonly correlationId: string;
  };
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly retryable: boolean;
  readonly correlationId: string;
  readonly status: number;

  constructor(params: {
    code: ApiErrorCode;
    message: string;
    retryable: boolean;
    correlationId: string;
    status: number;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code;
    this.retryable = params.retryable;
    this.correlationId = params.correlationId;
    this.status = params.status;
  }
}

function isErrorEnvelope(body: unknown): body is ErrorEnvelope {
  if (typeof body !== "object" || body === null) return false;
  const e = (body as { error?: unknown }).error;
  return typeof e === "object" && e !== null && typeof (e as { code?: unknown }).code === "string";
}

/** Map an HTTP response body to a typed ApiError. */
export function toApiError(status: number, body: unknown, correlationId: string): ApiError {
  if (isErrorEnvelope(body)) {
    return new ApiError({
      code: body.error.code as ApiErrorCode,
      message: body.error.message,
      retryable: body.error.retryable,
      correlationId: body.error.correlationId || correlationId,
      status,
    });
  }
  // Non-enveloped failure (e.g. gateway 502 HTML) — synthesise a stable shape.
  return new ApiError({
    code: status === 401 ? "UNAUTHENTICATED" : status === 403 ? "FORBIDDEN" : "INTERNAL",
    message: `Request failed with status ${status}`,
    retryable: status >= 500,
    correlationId,
    status,
  });
}

/** A user-facing message for any failure — never leaks internals. */
export function friendlyMessage(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "UNAUTHENTICATED":
        return "Your session has expired. Please sign in again.";
      case "FORBIDDEN":
        return "You don't have permission to view these results.";
      case "VALIDATION_FAILED":
        return err.message;
      case "CONFLICT":
        return "A customer with these details already exists (same name / duplicate). Try different details.";
      case "RATE_LIMITED":
        return "Too many requests — please slow down and try again.";
      case "TIMEOUT":
      case "NETWORK":
      case "DEPENDENCY_UNAVAILABLE":
        return "We couldn't reach the customer service. Please try again shortly.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

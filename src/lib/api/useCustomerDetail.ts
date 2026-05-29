// Fetches the customer detail aggregate for the customer screen. Reports
// loading / not-found / unavailable so the page can fall back to demo data for
// the built-in sample customers (or when the service is unreachable).

import * as React from "react";
import { getCustomerDetail, type CustomerDetail } from "./customerDetail";
import { ApiError } from "./errors";

export interface CustomerDetailState {
  detail: CustomerDetail | null;
  loading: boolean;
  notFound: boolean;
  /** Service unreachable / internal error (vs a genuine 404). */
  unavailable: boolean;
}

export function useCustomerDetail(id: string | undefined): CustomerDetailState {
  const [state, setState] = React.useState<CustomerDetailState>({
    detail: null,
    loading: Boolean(id),
    notFound: false,
    unavailable: false,
  });

  React.useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    // Deferred so we don't call setState synchronously in the effect body.
    const timer = setTimeout(() => {
      setState({ detail: null, loading: true, notFound: false, unavailable: false });
      getCustomerDetail(id, controller.signal)
        .then((detail) => setState({ detail, loading: false, notFound: false, unavailable: false }))
        .catch((err) => {
          if (controller.signal.aborted) return;
          const is404 = err instanceof ApiError && err.code === "NOT_FOUND";
          setState({
            detail: null,
            loading: false,
            notFound: is404,
            unavailable: !is404, // network/timeout/forbidden/internal → let the page fall back
          });
        });
    }, 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [id]);

  return state;
}

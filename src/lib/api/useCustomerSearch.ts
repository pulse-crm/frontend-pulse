// React hook driving the customer search tab against the live CAM API.
//
// • Debounces the query so we don't fire a request per keystroke.
// • Cancels in-flight requests when the query changes (no stale results land).
// • Surfaces loading / error / empty states for the UI to render.
// • Only searches once there is a query or an explicit page request — an empty
//   search box shows the default (recent / quick actions) experience.

import * as React from "react";
import type { Customer } from "@/data/mock";
import { searchCustomers } from "./customers";
import { ApiError, friendlyMessage } from "./errors";

const DEBOUNCE_MS = 300;
const PAGE_SIZE = 20;

export interface CustomerSearchState {
  customers: Customer[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  /** True when the search service is unreachable (vs a validation/permission error). */
  unavailable: boolean;
}

export interface UseCustomerSearchParams {
  query: string;
  /** Server-side filters (account status / customer type / segment). */
  status?: string;
  type?: string;
  segment?: string;
  enabled: boolean;
  page?: number;
}

export function useCustomerSearch(params: UseCustomerSearchParams): CustomerSearchState {
  const { query, status, type, segment, enabled, page = 1 } = params;
  const [state, setState] = React.useState<CustomerSearchState>({
    customers: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    loading: false,
    error: null,
    unavailable: false,
  });

  const q = query.trim();

  React.useEffect(() => {
    // When disabled the results section is not rendered, so we leave state as-is
    // and simply do no work — avoiding a synchronous setState in the effect body.
    if (!enabled) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, loading: true, error: null }));
      searchCustomers(
        {
          query: q || undefined,
          ...(status ? { status } : {}),
          ...(type ? { type } : {}),
          ...(segment ? { segment } : {}),
          page,
          pageSize: PAGE_SIZE,
        },
        controller.signal,
      )
        .then((res) => {
          setState({
            customers: res.customers,
            total: res.total,
            page: res.page,
            pageSize: res.pageSize,
            loading: false,
            error: null,
            unavailable: false,
          });
        })
        .catch((err) => {
          // A cancelled request (new keystroke / unmount) is not an error.
          if (controller.signal.aborted) return;
          const isUnavailable =
            err instanceof ApiError &&
            ["NETWORK", "TIMEOUT", "DEPENDENCY_UNAVAILABLE", "INTERNAL"].includes(err.code);
          setState((s) => ({
            ...s,
            customers: [],
            total: 0,
            loading: false,
            error: friendlyMessage(err),
            unavailable: isUnavailable,
          }));
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, status, type, segment, enabled, page]);

  return state;
}

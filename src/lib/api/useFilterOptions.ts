// Fetches the customer-search filter option lists from the API, with a static
// fallback so the filter bar still works if the service is unreachable.

import * as React from "react";
import { getFilterOptions, type FilterOption } from "./filters";

export interface FilterOptionLists {
  statuses: FilterOption[];
  types: FilterOption[];
  segments: FilterOption[];
  contractStatuses: FilterOption[];
}

// Mirrors the backend defaults; used until the API responds or if it fails.
export const FALLBACK_FILTER_OPTIONS: FilterOptionLists = {
  statuses: ["Active", "Pending", "Suspended", "Closed"].map((v) => ({ value: v, label: v })),
  types: [
    { value: "B2C", label: "Residential (B2C)" },
    { value: "B2B", label: "Business (B2B)" },
  ],
  segments: ["Consumer", "SMB", "Enterprise", "Government"].map((v) => ({ value: v, label: v })),
  contractStatuses: ["Active", "Expiring Soon", "Expired", "Renewed", "Pending"].map((v) => ({ value: v, label: v })),
};

export function useFilterOptions(): { options: FilterOptionLists; loading: boolean } {
  const [options, setOptions] = React.useState<FilterOptionLists>(FALLBACK_FILTER_OPTIONS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();
    getFilterOptions(controller.signal)
      .then((o) => {
        setOptions({
          statuses: o.statuses,
          types: o.types,
          segments: o.segments,
          contractStatuses: o.contractStatuses,
        });
        setLoading(false);
      })
      .catch(() => {
        // Keep the static fallback; the filter bar stays usable.
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { options, loading };
}

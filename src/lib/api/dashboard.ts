// Dashboard analytics API (CAM-owned slices: customer base + agent workload).
// Surveys/CSAT, ticket volume and revenue are foreign domains and are not served
// here — the page keeps demo data for those, clearly labelled.

import * as React from "react";
import { apiClient } from "./client";
import { endpoints } from "./endpoints";

export interface CountSlice {
  label: string;
  count: number;
  pct: number;
}

export interface CustomerBase {
  totalCustomers: number;
  totalAccounts: number;
  activeSubscribers: number;
  byStatus: CountSlice[];
  byType: CountSlice[];
  bySegment: CountSlice[];
  byBrand: CountSlice[];
  netGrowth: Array<{ label: string; value: number }>;
}

export interface AgentWorkloadRow {
  agent: string;
  accountsCreated: number;
  notesAuthored: number;
  discountsApplied: number;
  lifecycleChanges: number;
  recentViews: number;
  total: number;
}

export function getCustomerBase(signal?: AbortSignal): Promise<CustomerBase> {
  return apiClient.get<CustomerBase>(endpoints.dashboardCustomerBase, { ...(signal ? { signal } : {}) });
}

export function getAgentWorkload(signal?: AbortSignal): Promise<{ agents: AgentWorkloadRow[] }> {
  return apiClient.get<{ agents: AgentWorkloadRow[] }>(endpoints.dashboardAgentWorkload, {
    ...(signal ? { signal } : {}),
  });
}

export interface DashboardState {
  customerBase: CustomerBase | null;
  agentWorkload: AgentWorkloadRow[] | null;
  loading: boolean;
}

/** Fetches the CAM dashboard slices; leaves them null on failure (page falls back). */
export function useDashboard(): DashboardState {
  const [state, setState] = React.useState<DashboardState>({
    customerBase: null,
    agentWorkload: null,
    loading: true,
  });

  React.useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled([getCustomerBase(controller.signal), getAgentWorkload(controller.signal)]).then(
      ([cb, aw]) => {
        if (controller.signal.aborted) return;
        setState({
          customerBase: cb.status === "fulfilled" ? cb.value : null,
          agentWorkload: aw.status === "fulfilled" ? aw.value.agents : null,
          loading: false,
        });
      },
    );
    return () => controller.abort();
  }, []);

  return state;
}

import { apiClient } from "./api/client";
import { endpoints } from "./api/endpoints";
import { summaryToCustomer, type CustomerProfileSummary } from "./api/customers";
import type { Customer } from "@/data/mock";

const KEY = "pulse-recent-customers";
const MAX = 6;

/**
 * Record that the current agent viewed a customer (per-agent, server-side), and
 * mirror it to local storage as an offline cache. Best-effort — never throws.
 */
export async function recordRecentlyViewed(customerId: string): Promise<void> {
  pushRecentCustomerId(customerId);
  try {
    await apiClient.post(endpoints.recentlyViewed, { body: { customerId } });
    window.dispatchEvent(new CustomEvent("pulse-recent-customers-updated"));
  } catch {
    /* offline / unauthenticated — local cache still updated */
  }
}

/** Fetch the agent's recently-viewed customers (real data), newest first. */
export async function fetchRecentlyViewed(limit = 8): Promise<Customer[]> {
  const res = await apiClient.get<{ items: CustomerProfileSummary[] }>(endpoints.recentlyViewed, {
    params: { limit },
  });
  return res.items.map(summaryToCustomer);
}

export function getRecentCustomerIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function pushRecentCustomerId(id: string) {
  try {
    const current = getRecentCustomerIds().filter((x) => x !== id);
    const next = [id, ...current].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("pulse-recent-customers-updated"));
  } catch {
    /* storage may be unavailable */
  }
}

// Customer Profile (C2) API — the CAM-owned slice the search wizard and the
// New Customer wizard talk to. Request/response types mirror the published
// OpenAPI contract (service-template/openapi/customer-profile.yaml).

import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import { BRAND_ID } from "./config";
import type { Customer, CustomerStatus } from "@/data/mock";

// ---- Wire types (match the backend DTOs) -----------------------------------

export interface CustomerProfileSummary {
  customerId: string;
  brandId: string;
  givenName: string;
  familyName: string;
  preferredName: string | null;
  verificationStatus: string;
  createdAt: string;
  accountNumber: string | null;
  status: string | null; // account status: Active | Pending | Suspended | Closed
  type: string | null; // B2B | B2C
  segment: string | null;
}

export interface SearchCustomerProfilesResponse {
  items: CustomerProfileSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchCustomersParams {
  query?: string;
  brandId?: string;
  verificationStatus?: string;
  /** Account status filter: Active | Pending | Suspended | Closed. */
  status?: string;
  /** Customer type filter: B2B | B2C. */
  type?: string;
  /** Segment filter (matches the segments projection). */
  segment?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateCustomerInput {
  brandId?: string;
  givenName: string;
  familyName: string;
  title?: string;
  dateOfBirth?: string;
  languagePreference?: string;
  nationality?: string;
}

export interface CreateCustomerResult {
  customerId: string;
}

// ---- Mapping to the console's Customer view model --------------------------
//
// The identity service owns name + verification status only. Account number,
// contact details, segment, contract and credit/health are owned by OTHER CAM
// modules (Account, Contact, Address, Contract) and foreign domains, and are
// surfaced as neutral placeholders here until those reads are composed. Marked
// clearly so they are never mistaken for real values.

function mapVerificationToStatus(verification: string): CustomerStatus {
  switch (verification) {
    case "VERIFIED":
      return "Active";
    case "FAILED":
    case "EXPIRED":
      return "Suspended";
    default:
      return "Pending";
  }
}

/** A short, human-readable customer reference derived from the UUID. */
function displayRef(customerId: string): string {
  return `CUST-${customerId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function summaryToCustomer(s: CustomerProfileSummary): Customer {
  const name = s.preferredName?.trim() || `${s.givenName} ${s.familyName}`.trim();
  // Account fields (account number, status, type) come from the joined C1 account;
  // segment from the C2 segments projection. Fall back where a profile has no
  // linked account. email/phone/postcode are owned by other modules (not composed
  // here) and remain blank.
  const segment = (s.segment as Customer["segment"]) ?? "Consumer";
  return {
    id: s.customerId,
    name,
    accountNumber: s.accountNumber ?? displayRef(s.customerId),
    type: (s.type as Customer["type"]) ?? "B2C",
    status: (s.status as Customer["status"]) ?? mapVerificationToStatus(s.verificationStatus),
    email: "",
    phone: "",
    postcode: "",
    segment,
    contractStatus: "Pending", // owned by Customer Contract (C9) — not filtered server-side
    creditScore: 0, // owned by Revenue/Insight — unknown from identity
    arr: 0,
    joinedAt: s.createdAt.slice(0, 10),
    health: 0,
  };
}

// ---- Operations -------------------------------------------------------------

export async function searchCustomers(
  params: SearchCustomersParams,
  signal?: AbortSignal,
): Promise<{ customers: Customer[]; total: number; page: number; pageSize: number }> {
  const res = await apiClient.get<SearchCustomerProfilesResponse>(endpoints.customerProfiles, {
    params: {
      q: params.query,
      brandId: params.brandId ?? (BRAND_ID || undefined),
      verificationStatus: params.verificationStatus,
      status: params.status,
      type: params.type,
      segment: params.segment,
      page: params.page,
      pageSize: params.pageSize,
    },
    ...(signal ? { signal } : {}),
  });
  return {
    customers: res.items.map(summaryToCustomer),
    total: res.total,
    page: res.page,
    pageSize: res.pageSize,
  };
}

// ---- New-customer wizard onboarding (C5.2) -------------------------------

export interface NewCustomerWizardInput {
  customerType: "B2C" | "B2B";
  title?: string;
  givenName: string;
  familyName: string;
  companyName?: string;
  email: string;
  phone: string;
  address: { line1: string; line2?: string; city: string; region?: string; postcode: string };
  product?: { code: string; name: string; category: string; monthlyCharge: number; termMonths: number };
  marketingOptIn?: boolean;
}

export interface NewCustomerWizardResult {
  wizardSessionId: string;
  customerId: string;
  accountId: string;
  accountNumber: string;
  contractId: string | null;
}

/**
 * Submit the new-customer wizard. One call orchestrates the full onboarding on
 * the backend: wizard session + profile + account + link + contacts + address +
 * contract + consent + lifecycle state/onboarding (CAM HLD C5.2).
 */
export async function submitNewCustomerWizard(
  input: NewCustomerWizardInput,
): Promise<NewCustomerWizardResult> {
  return apiClient.post<NewCustomerWizardResult>(endpoints.newCustomerWizard, {
    idempotencyKey:
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
    body: { brandId: BRAND_ID || undefined, ...input },
  });
}

export async function createCustomer(input: CreateCustomerInput): Promise<CreateCustomerResult> {
  // Idempotency-Key makes a retried submit safe (Ground Rules II §9): the server
  // returns the already-created record instead of creating a duplicate.
  const idempotencyKey =
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return apiClient.post<CreateCustomerResult>(endpoints.customerProfiles, {
    idempotencyKey,
    body: {
      brandId: input.brandId ?? BRAND_ID,
      givenName: input.givenName,
      familyName: input.familyName,
      ...(input.title ? { title: input.title } : {}),
      ...(input.dateOfBirth ? { dateOfBirth: input.dateOfBirth } : {}),
      ...(input.languagePreference ? { languagePreference: input.languagePreference } : {}),
      ...(input.nationality ? { nationality: input.nationality } : {}),
    },
  });
}

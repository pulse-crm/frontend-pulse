// Central registry of API endpoint paths the console calls.
//
// DATA OWNERSHIP (Pulse Ground Rules I §3): the Customer & Commercial Core (CAM)
// owns customer identity/profile/account. Tickets are owned by the CARE domain
// and Orders by the FULFILMENT domain — CAM neither stores nor serves them. The
// customer-search wizard therefore searches:
//   • Customers  → CAM Customer Profile (live API, below)
//   • Tickets    → Care domain      (FOREIGN — see foreign-domains.ts)
//   • Orders     → Fulfilment domain (FOREIGN — see foreign-domains.ts)
// Each foreign domain exposes its own search behind Kong; those are intentionally
// not implemented here and remain demo data until those services are wired.

export const endpoints = {
  /** CAM Customer Profile (C2) — owned by this domain. */
  customerProfiles: "/customer-profiles",
  customerProfile: (id: string) => `/customer-profiles/${encodeURIComponent(id)}`,

  /** Customer-search filter vocabularies + tag catalogue (CAM Customer Account, C1). */
  customerFilterOptions: "/customer-filter-options",
  customerTags: "/customer-tags",

  /** New-customer wizard onboarding orchestration (CAM Customer Lifecycle, C5.2). */
  newCustomerWizard: "/new-customer-wizard",

  /** Customer detail aggregate for the customer screen (CAM Customer 360, C8). */
  customerDetail: (id: string) => `/customers/${encodeURIComponent(id)}/detail`,

  /** Per-agent recently-viewed customers (CAM Customer 360, C8). */
  recentlyViewed: "/recently-viewed",

  /** Contract renewal — the CAM-owned retention action (Customer Contract, C9). */
  contractRenew: (id: string) => `/contracts/${encodeURIComponent(id)}/renew`,
  /** Apply a discount/concession to a contract (active service) — C9. */
  contractDiscount: (id: string) => `/contracts/${encodeURIComponent(id)}/discounts`,

  /** Dashboard analytics — CAM-owned slices (Customer 360, C8). */
  dashboardCustomerBase: "/dashboard/customer-base",
  dashboardAgentWorkload: "/dashboard/agent-workload",

  /** Read-only catalogue of RBAC permissions CAM enforces (Customer 360, C8).
   *  Identity/user management itself is the Keycloak/IAM domain — not CAM. */
  accessPermissions: "/access/permissions",

  /** CAM immutable audit log (Ground Rules I §6.3). */
  audit: "/audit",
} as const;

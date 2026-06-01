// Customer detail aggregate API (CAM Customer 360 BFF) + mappers to the console's
// view models. Returns the CAM-owned slices for the customer screen; foreign
// domains (tickets/orders/invoices/payments/devices/interactions) aren't part of
// CAM and are surfaced as empty by the page.

import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type {
  Customer,
  CustomerStatus,
  CustomerType,
  CustomerSegment,
  ContractStatus,
  Subscription,
  Note,
  Invoice,
} from "@/data/mock";

export interface CustomerDetail {
  customerId: string;
  givenName: string;
  familyName: string;
  preferredName: string | null;
  dateOfBirth: string | null;
  verificationStatus: string;
  createdAt: string;
  account: {
    accountId: string;
    accountNumber: string;
    status: string;
    type: string | null;
    brandId: string;
    displayName: string;
  } | null;
  segment: string | null;
  email: string | null;
  phone: string | null;
  postcode: string | null;
  contacts: Array<{ type: string; value: string; isPrimary: boolean; verificationStatus: string }>;
  addresses: Array<{
    line1: string; line2: string | null; city: string; region: string | null; postcode: string;
    isPrimaryBilling: boolean; isPrimaryService: boolean;
  }>;
  contracts: Array<{
    contractId: string; contractRef: string; productName: string; productCategory: string; status: string;
    monthlyRecurringCharge: number; currency: string; startDate: string; endDate: string | null; termMonths: number;
    catalogueVersionId: string;
    discounts: Array<{ discountType: string; value: number; durationMonths: number | null; reason: string }>;
  }>;
  subscriptions: Array<{
    externalSubscriptionId: string; productLabel: string; statusLabel: string;
    monthlyAmount: number | null; lastEventAt: string;
  }>;
  lifecycleState: string | null;
  notes: Array<{ id: string; authorId: string; category: string; body: string; pinned: boolean; createdAt: string }>;
  consent: Array<{ category: string; channel: string; state: string; occurredAt: string }>;
  billing: {
    balanceAmount: number;
    balanceStatus: string;
    currency: string;
    paymentMethodType: string | null;
    paymentMethodLast4: string | null;
    lastInvoiceAt: string | null;
    nextBillingCycleAt: string | null;
    recentInvoices: Array<{
      externalInvoiceId: string; invoicedAt: string; amount: number; currency: string;
      statusLabel: string; summary: string | null;
    }>;
  } | null;
  /** CAM-derived customer value (0–100) + tier, computed by Customer 360 from
   *  CAM-owned signals (spend / tenure / billing health / active services). */
  valueScore: number;
  valueTier: string;
  partial: boolean;
}

export async function getCustomerDetail(id: string, signal?: AbortSignal): Promise<CustomerDetail> {
  return apiClient.get<CustomerDetail>(endpoints.customerDetail(id), { ...(signal ? { signal } : {}) });
}

// ---- Mappers to the console view models ------------------------------------

const CONTRACT_TO_FRONTEND: Record<string, ContractStatus> = {
  ACTIVE: "Active", RENEWED: "Renewed", OUT_OF_CONTRACT: "Expired",
  TERMINATED: "Expired", CANCELLED: "Expired", DRAFT: "Pending",
};
const CONTRACT_TO_SUB_STATUS: Record<string, Subscription["status"]> = {
  ACTIVE: "Active", RENEWED: "Active", DRAFT: "Paused",
  OUT_OF_CONTRACT: "Cancelled", TERMINATED: "Cancelled", CANCELLED: "Cancelled",
};
const SUB_LABEL_TO_STATUS: Record<string, Subscription["status"]> = {
  ACTIVE: "Active", SUSPENDED: "Paused", CANCELLED: "Cancelled", CEASED: "Cancelled",
};

/** Build the console Customer view model from the detail aggregate. */
export function detailToCustomer(d: CustomerDetail): Customer {
  const name = d.preferredName?.trim() || `${d.givenName} ${d.familyName}`.trim();
  const arr = d.contracts.reduce((s, c) => s + c.monthlyRecurringCharge * 12, 0);
  return {
    id: d.customerId,
    name,
    accountNumber: d.account?.accountNumber ?? `CUST-${d.customerId.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    type: (d.account?.type as CustomerType) ?? "B2C",
    status: (d.account?.status as CustomerStatus) ?? "Pending",
    email: d.email ?? "",
    phone: d.phone ?? "",
    postcode: d.postcode ?? "",
    segment: (d.segment as CustomerSegment) ?? "Consumer",
    contractStatus: CONTRACT_TO_FRONTEND[d.contracts[0]?.status ?? ""] ?? "Pending",
    creditScore: 0, // owned by Revenue/Insight — not part of CAM
    arr,
    joinedAt: d.createdAt.slice(0, 10),
    health: 0, // owned by Insight — not part of CAM
  };
}

/** Collapse identical active discounts (e.g. the same offer applied twice) so
 *  they neither duplicate in the UI nor double-count in pricing. */
function dedupeDiscounts<T extends { discountType: string; value: number; durationMonths: number | null; reason?: string }>(
  list: T[],
): T[] {
  const seen = new Set<string>();
  return list.filter((d) => {
    const key = `${d.discountType}|${d.value}|${d.durationMonths ?? ""}|${d.reason ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Apply active discounts to a base monthly charge (percentage then fixed). */
export function effectiveMonthly(
  base: number,
  discounts: Array<{ discountType: string; value: number }>,
): number {
  let m = base;
  for (const d of discounts) {
    m -= d.discountType === "PERCENTAGE" ? (base * d.value) / 100 : d.value;
  }
  return Math.max(0, Math.round(m * 100) / 100);
}

/** Services = CAM contracts (C9) + any subscription projection rows (C7). */
export function detailToSubscriptions(d: CustomerDetail): Subscription[] {
  const fromContracts: Subscription[] = d.contracts.map((c) => ({
    id: c.contractRef,
    customerId: d.customerId,
    product: c.discounts.length > 0 ? `${c.productName} (discount applied)` : c.productName,
    startDate: c.startDate,
    renewalDate: c.endDate ?? c.startDate,
    monthly: effectiveMonthly(c.monthlyRecurringCharge, dedupeDiscounts(c.discounts)),
    status: CONTRACT_TO_SUB_STATUS[c.status] ?? "Active",
  }));
  const fromSubs: Subscription[] = d.subscriptions.map((s) => ({
    id: s.externalSubscriptionId,
    customerId: d.customerId,
    product: s.productLabel,
    startDate: s.lastEventAt.slice(0, 10),
    renewalDate: s.lastEventAt.slice(0, 10),
    monthly: s.monthlyAmount ?? 0,
    status: SUB_LABEL_TO_STATUS[s.statusLabel?.toUpperCase()] ?? "Active",
  }));
  return [...fromContracts, ...fromSubs];
}

const INVOICE_STATUS: Record<string, Invoice["status"]> = {
  paid: "Paid", due: "Pending", overdue: "Overdue", disputed: "Overdue",
};

/** Invoices for the Billing panel, from the C7 billing read-cache. */
export function detailToInvoices(d: CustomerDetail): Invoice[] {
  if (!d.billing) return [];
  const name = d.preferredName?.trim() || `${d.givenName} ${d.familyName}`.trim();
  return d.billing.recentInvoices.map((inv) => ({
    id: inv.externalInvoiceId,
    customer: name,
    amount: inv.amount,
    status: INVOICE_STATUS[inv.statusLabel?.toLowerCase()] ?? "Pending",
    issueDate: inv.invoicedAt.slice(0, 10),
    dueDate: inv.invoicedAt.slice(0, 10),
  }));
}

/** A discount row for the Billing panel's "Discounts & Promotions" table. */
export interface DiscountRow {
  id: string;
  code: string;
  type: "Percentage" | "Fixed";
  value: number;
  status: "Active" | "Expired";
  period: string;
  appliesTo: string;
}

/** Active CAM contract discounts (C9) as Billing-panel rows. The reason carries
 *  the offer name; period is the discount duration; appliesTo is the product. */
export function detailToDiscounts(d: CustomerDetail): DiscountRow[] {
  return d.contracts.flatMap((c) =>
    dedupeDiscounts(c.discounts).map((dis, i) => ({
      id: `${c.contractId}-${i}`,
      code: dis.reason?.trim() || (dis.discountType === "PERCENTAGE" ? `${dis.value}% discount` : "Account credit"),
      type: dis.discountType === "PERCENTAGE" ? "Percentage" : "Fixed",
      value: dis.value,
      status: "Active" as const,
      period: dis.durationMonths ? `${dis.durationMonths} months` : "One-time",
      appliesTo: c.productName,
    })),
  );
}

/** Outstanding balance from the billing read-cache (0 if in credit / no billing). */
export function outstandingFromBilling(d: CustomerDetail): number {
  return d.billing && d.billing.balanceAmount > 0 ? d.billing.balanceAmount : 0;
}

export function detailToNotes(d: CustomerDetail): Note[] {
  return d.notes.map((n) => ({
    id: n.id,
    customerId: d.customerId,
    author: n.category ? `Agent · ${n.category}` : "Agent",
    body: n.body,
    when: n.createdAt,
    pinned: n.pinned,
  }));
}

// ---- Contract renewal (the CAM-owned retention action, C9) ------------------

export interface RenewableContract {
  contractId: string;
  productName: string;
  termMonths: number;
  monthlyRecurringCharge: number;
  catalogueVersionId: string;
}

/** Pick the contract a renewal should target (active/expiring), or null. */
export function pickRenewableContract(d: CustomerDetail): RenewableContract | null {
  const renewable = ["ACTIVE", "RENEWED", "OUT_OF_CONTRACT"];
  const c = d.contracts.find((x) => renewable.includes(x.status)) ?? d.contracts[0];
  if (!c) return null;
  return {
    contractId: c.contractId,
    productName: c.productName,
    termMonths: c.termMonths || 12,
    monthlyRecurringCharge: c.monthlyRecurringCharge,
    catalogueVersionId: c.catalogueVersionId,
  };
}

export interface RenewContractResult {
  successorContractId: string;
}

/** Renew a contract (straight renewal: same term/charge unless overridden). */
export async function renewContract(
  contractId: string,
  input: { newTermMonths: number; newCatalogueVersionId: string; newMonthlyRecurringCharge: number },
): Promise<RenewContractResult> {
  return apiClient.post<RenewContractResult>(endpoints.contractRenew(contractId), { body: input });
}

// ---- Apply a discount to an active service (contract, C9) -------------------

export interface ApplyDiscountInput {
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  reason: string;
  durationMonths?: number;
}

export async function applyServiceDiscount(
  contractId: string,
  input: ApplyDiscountInput,
): Promise<{ discountId: string }> {
  return apiClient.post<{ discountId: string }>(endpoints.contractDiscount(contractId), {
    body: input,
  });
}

// ---- Save an internal note against the account (C1) -------------------------

export interface SaveAccountNoteInput {
  body: string;
  category?: string;
  visibility?: string;
  pinned?: boolean;
}

export async function saveAccountNote(
  accountId: string,
  input: SaveAccountNoteInput,
): Promise<{ noteId: string }> {
  return apiClient.post<{ noteId: string }>(endpoints.accountNote(accountId), { body: input });
}

export async function setAccountNotePinned(
  accountId: string,
  noteId: string,
  pinned: boolean,
): Promise<void> {
  await apiClient.patch(endpoints.accountNoteById(accountId, noteId), { body: { pinned } });
}

export async function deleteAccountNote(accountId: string, noteId: string): Promise<void> {
  await apiClient.del(endpoints.accountNoteById(accountId, noteId));
}

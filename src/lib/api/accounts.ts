// Customer Account (C1) write actions.

import { apiClient } from "./client";
import { endpoints } from "./endpoints";

/** Change an account's status (e.g. SUSPENDED). Goes through the C1 state machine. */
export async function changeAccountStatus(
  accountId: string,
  input: { newStatus: "ACTIVE" | "PENDING" | "SUSPENDED" | "CLOSED"; reasonCode: string },
): Promise<{ status: string }> {
  return apiClient.patch<{ status: string }>(endpoints.accountStatus(accountId), { body: input });
}

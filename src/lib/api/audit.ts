// CAM audit-log API (Ground Rules I §6.3) — the immutable record of owned-data
// changes + restricted-field reads CAM wrote. Read-only.

import { apiClient } from "./client";
import { endpoints } from "./endpoints";

interface AuditEntryDto {
  id: string;
  occurredAt: string;
  actor: string;
  isService: boolean;
  changeType: string;
  entityType: string;
  entityId: string;
  source: string;
  correlationId: string;
  details: string;
}

/** Shape the AuditLog page consumes (matches its local AuditEntry interface). */
export interface AuditRow {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export async function fetchAuditLog(signal?: AbortSignal): Promise<AuditRow[]> {
  const r = await apiClient.get<{ items: AuditEntryDto[] }>(endpoints.audit, {
    params: { pageSize: 200 },
    ...(signal ? { signal } : {}),
  });
  return r.items.map((e) => ({
    id: e.id,
    timestamp: e.occurredAt,
    user: e.actor,
    role: e.isService ? "Service" : "Agent",
    action: e.changeType,
    entity: e.entityType,
    entityId: e.entityId,
    details: e.details,
  }));
}

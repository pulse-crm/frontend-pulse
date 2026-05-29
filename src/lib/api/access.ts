// Access / permissions API. Read-only catalogue of the RBAC permissions the CAM
// service enforces — used to populate permission pickers with real role keys.
//
// Creating users and assigning roles is NOT here: that's the Identity & Access /
// Keycloak domain (Ground Rules I §6.1 — "build no identity layer"). Those UI
// actions remain foreign (Keycloak Admin API via the IAM service).

import * as React from "react";
import { apiClient } from "./client";
import { endpoints } from "./endpoints";

export interface AccessPermission {
  key: string;
  label: string;
  description: string;
  capability: string;
}

export function getAccessPermissions(signal?: AbortSignal): Promise<{ permissions: AccessPermission[] }> {
  return apiClient.get<{ permissions: AccessPermission[] }>(endpoints.accessPermissions, {
    ...(signal ? { signal } : {}),
  });
}

/** Fetch CAM's enforced-permission catalogue; empty on failure. */
export function useAccessPermissions(): { permissions: AccessPermission[]; loading: boolean } {
  const [permissions, setPermissions] = React.useState<AccessPermission[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();
    getAccessPermissions(controller.signal)
      .then((r) => setPermissions(r.permissions))
      .catch(() => {
        /* keep empty; the section simply doesn't render */
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { permissions, loading };
}

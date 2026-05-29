// Customer-search filter vocabularies + tag catalogue API (CAM Customer Account).
// Filter option lists are served by the backend (so an operator can change them
// without a frontend deploy); tags are dynamic — listed and created via the API.

import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type { CustomerTag } from "@/lib/tags";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  statuses: FilterOption[];
  types: FilterOption[];
  segments: FilterOption[];
  contractStatuses: FilterOption[];
  tags: CustomerTag[];
}

interface TagDto {
  id: string;
  label: string;
  colour: string;
}

interface FilterOptionsResponse {
  statuses: FilterOption[];
  types: FilterOption[];
  segments: FilterOption[];
  contractStatuses: FilterOption[];
  tags: TagDto[];
}

// Backend uses British "colour"; the console's CustomerTag uses "color".
const toTag = (t: TagDto): CustomerTag => ({ id: t.id, label: t.label, color: t.colour });

export async function getFilterOptions(signal?: AbortSignal): Promise<FilterOptions> {
  const r = await apiClient.get<FilterOptionsResponse>(endpoints.customerFilterOptions, {
    ...(signal ? { signal } : {}),
  });
  return {
    statuses: r.statuses,
    types: r.types,
    segments: r.segments,
    contractStatuses: r.contractStatuses,
    tags: r.tags.map(toTag),
  };
}

export async function listTags(signal?: AbortSignal): Promise<CustomerTag[]> {
  const r = await apiClient.get<TagDto[]>(endpoints.customerTags, { ...(signal ? { signal } : {}) });
  return r.map(toTag);
}

export async function createTag(label: string, color?: string): Promise<CustomerTag> {
  const r = await apiClient.post<TagDto>(endpoints.customerTags, {
    body: { label, ...(color ? { colour: color } : {}) },
  });
  return toTag(r);
}

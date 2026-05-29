import * as React from "react";
import { Filter, X, Tag, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible/collapsible";
import type { CustomerTag } from "@/lib/tags";
import type { FilterOptionLists } from "@/lib/api/useFilterOptions";

export interface CustomerFilters {
  status: string;
  type: string;
  segment: string;
  contractStatus: string;
  tagId: string;
}

export const emptyFilters: CustomerFilters = {
  status: "",
  type: "",
  segment: "",
  contractStatus: "",
  tagId: "",
};

interface CustomerFilterBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  /** Filter option lists (fetched from the API). */
  options: FilterOptionLists;
  tags: CustomerTag[];
  /** Create a new tag by label; persistence is handled by the caller (API). */
  onAddTag: (label: string) => void;
}

export function CustomerFilterBar({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  options,
  tags,
  onAddTag,
}: CustomerFilterBarProps) {
  const [newTagInput, setNewTagInput] = React.useState("");
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const setFilter = (patch: Partial<CustomerFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  const handleAddTag = () => {
    const label = newTagInput.trim();
    if (!label) return;
    onAddTag(label);
    setNewTagInput("");
  };

  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleContent>
        <Card>
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" /> Filter Customers
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px]"
                  onClick={() => onFiltersChange(emptyFilters)}
                >
                  <X className="h-2.5 w-2.5" /> Clear all
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Select
                value={filters.status}
                onValueChange={(v) => setFilter({ status: v === "all" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {options.statuses.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.type}
                onValueChange={(v) => setFilter({ type: v === "all" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {options.types.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.segment}
                onValueChange={(v) => setFilter({ segment: v === "all" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  {options.segments.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.contractStatus}
                onValueChange={(v) => setFilter({ contractStatus: v === "all" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Contract" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contracts</SelectItem>
                  {options.contractStatuses.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.tagId}
                onValueChange={(v) => setFilter({ tagId: v === "all" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: t.color }}
                        />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
              <Input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="New tag name…"
                size="sm"
                className="h-7 text-xs flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={handleAddTag}
                disabled={!newTagInput.trim()}
              >
                <Plus className="h-2.5 w-2.5" /> Add Tag
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

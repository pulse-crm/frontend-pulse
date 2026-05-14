import * as React from "react";
import { Download, Tag, GitMerge, X } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import type { CustomerTag } from "@/lib/tags";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onExport: () => void;
  onBulkTag: (tagId: string) => void;
  onMerge: () => void;
  availableTags: CustomerTag[];
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onExport,
  onBulkTag,
  onMerge,
  availableTags,
}: BulkActionsBarProps) {
  const [tagId, setTagId] = React.useState<string | undefined>();

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-md bg-primary/10 border border-primary/30 text-sm flex-wrap">
      <span className="font-medium text-primary">{selectedCount} selected</span>
      <span className="text-muted-foreground">·</span>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-3.5 w-3.5" /> Export CSV
      </Button>
      <div className="flex items-center gap-1">
        <div className="w-40">
          <Select
            value={tagId}
            onValueChange={(v) => {
              setTagId(v);
              onBulkTag(v);
              setTimeout(() => setTagId(undefined), 50);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Apply tag…" />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map((t) => (
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
        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <Button variant="outline" size="sm" onClick={onMerge} disabled={selectedCount < 2}>
        <GitMerge className="h-3.5 w-3.5" /> Merge
      </Button>
      <Button variant="ghost" size="sm" className="ml-auto" onClick={onClearSelection}>
        <X className="h-3.5 w-3.5" /> Clear
      </Button>
    </div>
  );
}

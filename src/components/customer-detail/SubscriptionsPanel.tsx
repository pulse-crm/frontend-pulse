import * as React from "react";
import { Wifi, ChevronDown, ChevronRight, Tag, Trash2 } from "lucide-react";
import { CollapsiblePanel } from "./CollapsiblePanel";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table/table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Subscription } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "@/components/ui/toast/toaster";

interface ServiceDiscount {
  id: string;
  label: string;
  /** "global" → spans all services; "local" → scoped to this service. */
  scope: "global" | "local";
  /** "Percentage" or fixed-currency reduction. */
  kind: "Percentage" | "Fixed";
  amount: number;
  period: string;
  status: "Active" | "Expired";
}

/** Each subscription in the mock data lacks discount rows, so we synthesize a
 *  consistent set per service id for the expanded view. */
function discountsFor(sub: Subscription): ServiceDiscount[] {
  const tail = sub.id.slice(-1);
  const offset = parseInt(tail, 10) || 0;
  const list: ServiceDiscount[] = [];
  if (offset % 2 === 0) {
    list.push({
      id: `${sub.id}-DG1`,
      label: "Loyalty Discount",
      scope: "global",
      kind: "Percentage",
      amount: 10,
      period: "Recurring · 12 months",
      status: "Active",
    });
  }
  if (offset % 3 === 0) {
    list.push({
      id: `${sub.id}-DL1`,
      label: "Speed Tier Promo",
      scope: "local",
      kind: "Fixed",
      amount: 5,
      period: `Linked to ${sub.product}`,
      status: "Active",
    });
  }
  if (sub.status !== "Active") {
    list.push({
      id: `${sub.id}-DE1`,
      label: "Welcome Bonus",
      scope: "local",
      kind: "Fixed",
      amount: 20,
      period: "Ended · 2025-12-31",
      status: "Expired",
    });
  }
  return list;
}

function discountLabel(d: ServiceDiscount): string {
  return d.kind === "Percentage" ? `−${d.amount}%` : `−${formatCurrency(d.amount)}`;
}

export function SubscriptionsPanel({ data }: { data: Subscription[] }) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleRemove = (label: string) =>
    toast({ title: "Discount removed", description: `${label} cleared from service.` });

  return (
    <CollapsiblePanel title="Active Services" icon={Wifi} count={data.length}>
      <Table>
        <TableHeader>
          <tr>
            <TableHead className="w-8" />
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Renewal</TableHead>
            <TableHead className="text-right">Monthly</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <tr>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No active services
              </TableCell>
            </tr>
          )}
          {data.map((s) => {
            const isOpen = expanded.has(s.id);
            const discounts = discountsFor(s);
            return (
              <React.Fragment key={s.id}>
                <TableRow className="cursor-pointer hover:bg-accent/50" onClick={() => toggle(s.id)}>
                  <TableCell className="py-2 w-8">
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="py-2 font-medium">{s.product}</TableCell>
                  <TableCell className="py-2">
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="py-2 text-xs">{formatDate(s.startDate)}</TableCell>
                  <TableCell className="py-2 text-xs">{formatDate(s.renewalDate)}</TableCell>
                  <TableCell className="py-2 text-right font-mono text-xs">
                    {formatCurrency(s.monthly)}
                  </TableCell>
                </TableRow>
                {isOpen && discounts.length === 0 && (
                  <TableRow className="bg-muted/30">
                    <TableCell className="py-2" />
                    <TableCell colSpan={5} className="py-2 text-xs text-muted-foreground">
                      No discounts applied to this service.
                    </TableCell>
                  </TableRow>
                )}
                {isOpen &&
                  discounts.map((d) => (
                    <TableRow key={d.id} className="bg-muted/30">
                      <TableCell className="py-2" />
                      <TableCell className="py-2 text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <Tag
                            className={`h-3 w-3 ${
                              d.scope === "global" ? "text-primary" : "text-success"
                            }`}
                          />
                          {d.label}
                          <span className="text-muted-foreground">— {discountLabel(d)}</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-xs text-muted-foreground" colSpan={2}>
                        {d.period}
                      </TableCell>
                      <TableCell className="py-2">
                        <StatusBadge status={d.status} />
                      </TableCell>
                      <TableCell className="py-2 text-right">
                        <span className="inline-flex items-center gap-2">
                          <span className="font-mono text-xs text-destructive">
                            {discountLabel(d)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(d.label);
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove discount"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </CollapsiblePanel>
  );
}

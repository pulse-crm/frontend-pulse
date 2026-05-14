import { Clock, Users, ArrowUpCircle, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "@/components/ui/toast/toaster";
import type { Ticket } from "@/data/mock";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";

interface TicketDetailDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function slaInfo(t: Ticket) {
  const created = Date.parse(t.createdAt);
  const deadline = Date.parse(t.slaDeadline);
  const now = Date.now();
  const total = deadline - created;
  const elapsed = now - created;
  const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  const breached = now > deadline && t.status !== "Resolved" && t.status !== "Closed";
  return { pct, breached, deadline };
}

function slaBarClass(pct: number, breached: boolean) {
  if (breached) return "bg-destructive";
  if (pct >= 80) return "bg-warning";
  return "bg-primary";
}

export function TicketDetailDialog({ ticket, open, onOpenChange }: TicketDetailDialogProps) {
  if (!ticket) return null;
  const { pct, breached, deadline } = slaInfo(ticket);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
            {ticket.subject}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={ticket.priority} />
            <StatusBadge status={ticket.status} />
            <span className="text-xs text-muted-foreground">
              <Tag className="inline h-3 w-3 mr-0.5" /> Category: <strong>{ticket.category}</strong>
            </span>
            <span className="text-xs text-muted-foreground">
              <Users className="inline h-3 w-3 mr-0.5" /> Assignee: <strong>{ticket.assignee}</strong>
            </span>
          </div>

          <div className="rounded-lg bg-muted/30 border border-border p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> Resolution SLA
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  breached ? "text-destructive" : pct >= 80 ? "text-warning" : "text-muted-foreground"
                )}
              >
                {breached ? "BREACHED" : `${pct}% elapsed`}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={cn("h-full", slaBarClass(pct, breached))} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Due {formatDateTime(deadline.toString())}
            </p>
          </div>

          <div className="rounded-lg bg-accent/30 p-3 space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Routing</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Assigned to <strong>{ticket.assignee}</strong> via skills-based routing on the{" "}
              <strong>{ticket.category}</strong> team.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs mt-1"
              onClick={() => toast({ title: "Transfer", description: `Transferring ${ticket.id}…` })}
            >
              <ArrowUpCircle className="h-3 w-3" /> Transfer Ticket
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                toast({ title: "Resolved", description: `${ticket.id} marked as resolved.`, variant: "success" });
              }}
            >
              Mark Resolved
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Check, X } from "lucide-react";
import { toast } from "@/components/ui/toast/toaster";

const approvals = [
  { id: "AP-1", requester: "Sarah Chen", initials: "SC", title: "Refund INV-2026-003 (£4,200)", reason: "Service-credit owed under SLA", priority: "High" },
  { id: "AP-2", requester: "Marcus Lee", initials: "ML", title: "Discount Stark Industries (£12,000 / yr)", reason: "Renewal negotiation", priority: "Medium" },
  { id: "AP-3", requester: "Priya Patel", initials: "PP", title: "Off-cycle billing adjustment for Hooli", reason: "Customer onboarded mid-cycle", priority: "Low" },
];

export default function Approvals() {
  return (
    <div className="page-stack">
      <PageHeader title="Approvals" description="Items waiting on your decision." />
      <div className="space-y-3">
        {approvals.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-5 flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{a.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{a.title}</p>
                  <StatusBadge status={a.priority} />
                  <Badge variant="outline" className="font-mono text-[10px]">{a.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Requested by {a.requester} — {a.reason}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast({ title: "Rejected", description: a.id, variant: "destructive" })}
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => toast({ title: "Approved", description: a.id, variant: "success" })}
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

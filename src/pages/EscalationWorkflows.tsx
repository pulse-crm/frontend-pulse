import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { GitBranch, ArrowRight, Plus } from "lucide-react";
import { IconBox } from "@/components/ui/icon-box/icon-box";

const workflows = [
  {
    name: "Critical Network Outage",
    trigger: "Priority = Critical AND Category = Network",
    steps: ["L1 Agent", "Senior Tech Ops", "NOC Team", "Director"],
    active: true,
  },
  {
    name: "Enterprise SLA Breach",
    trigger: "Segment = Enterprise AND SLA breached",
    steps: ["Account Owner", "Enterprise Lead", "VP CS"],
    active: true,
  },
  {
    name: "Billing Dispute > £10k",
    trigger: "Category = Billing AND Amount > £10,000",
    steps: ["L1 Agent", "Billing Team", "Finance Director"],
    active: false,
  },
];

export default function EscalationWorkflows() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Escalation Workflows"
        description="Define how high-impact tickets traverse the team."
        action={<Button><Plus className="h-3.5 w-3.5" /> New workflow</Button>}
      />
      <div className="space-y-3">
        {workflows.map((w) => (
          <Card key={w.name}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <IconBox icon={GitBranch} tone="primary" size="md" shape="square" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{w.name}</p>
                    <Badge tone={w.active ? "success" : "neutral"}>{w.active ? "Active" : "Disabled"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Trigger: {w.trigger}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {w.steps.map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{s}</Badge>
                        {i < w.steps.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

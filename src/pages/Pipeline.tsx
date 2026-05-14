import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import { Plus } from "lucide-react";
import { deals, type Deal } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

const stages: Deal["stage"][] = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

const stageColor: Record<Deal["stage"], string> = {
  Lead: "border-muted",
  Qualified: "border-info",
  Proposal: "border-primary",
  Negotiation: "border-warning",
  Won: "border-success",
  Lost: "border-destructive",
};

export default function Pipeline() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Pipeline"
        description="Track every deal from lead through close."
        action={
          <Button><Plus className="h-3.5 w-3.5" /> New deal</Button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const total = stageDeals.reduce((s, d) => s + d.value, 0);
          return (
            <Card key={stage} className={`border-t-2 ${stageColor[stage]}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider">{stage}</CardTitle>
                  <Badge variant="outline" className="text-[10px]">{stageDeals.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatCurrency(total, 0)}</p>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {stageDeals.map((d) => (
                  <div key={d.id} className="rounded-md border border-border bg-card p-2.5 hover:shadow-sm transition-shadow cursor-pointer">
                    <p className="text-sm font-medium truncate">{d.company}</p>
                    <p className="text-xs text-muted-foreground truncate">{d.owner}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-sm font-semibold">{formatCurrency(d.value, 0)}</span>
                      <span className="text-[10px] text-muted-foreground">{d.updated}</span>
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <p className="text-xs text-muted-foreground italic py-3 text-center">No deals</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

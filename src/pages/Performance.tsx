import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { BarChart } from "@/components/charts/bar-chart";
import { Progress } from "@/components/ui/progress/progress";
import { Activity, Target, Clock, Users } from "lucide-react";

const handlesByAgent = [
  { label: "S. Chen", value: 142 },
  { label: "M. Lee", value: 118 },
  { label: "P. Patel", value: 96 },
  { label: "D. Alvarez", value: 134 },
  { label: "N. Sokolova", value: 51 },
];

const agents = [
  { name: "Sarah Chen", csat: 91, resolved: 142, sla: 96 },
  { name: "Marcus Lee", csat: 87, resolved: 118, sla: 89 },
  { name: "Priya Patel", csat: 84, resolved: 96, sla: 92 },
  { name: "Diego Alvarez", csat: 79, resolved: 134, sla: 81 },
  { name: "Nina Sokolova", csat: 95, resolved: 51, sla: 99 },
];

export default function Performance() {
  return (
    <div className="page-stack">
      <PageHeader title="Performance" description="Agent and team KPIs at a glance." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Avg Handle Time" value="6m 12s" delta={-4.1} icon={Clock} iconTone="primary" />
        <StatCard label="Resolved Today" value="78" delta={8.4} icon={Target} iconTone="success" />
        <StatCard label="Team CSAT" value="86%" delta={1.2} icon={Activity} iconTone="info" />
        <StatCard label="Active Agents" value="14" deltaLabel="5 on break" icon={Users} iconTone="warning" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tickets Resolved by Agent</CardTitle></CardHeader>
          <CardContent><BarChart data={handlesByAgent} height={220} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Agent Scorecards</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {agents.map((a) => (
              <div key={a.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium">{a.name}</p>
                  <span className="text-xs text-muted-foreground">{a.resolved} resolved · CSAT {a.csat}% · SLA {a.sla}%</span>
                </div>
                <Progress value={a.csat} tone={a.csat >= 90 ? "success" : a.csat >= 80 ? "primary" : "warning"} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

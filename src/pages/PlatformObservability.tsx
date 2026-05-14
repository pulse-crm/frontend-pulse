import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { Activity, Gauge, AlertTriangle, Server } from "lucide-react";

const latency = [
  { label: "00:00", value: 110 }, { label: "04:00", value: 95 }, { label: "08:00", value: 140 },
  { label: "12:00", value: 168 }, { label: "16:00", value: 152 }, { label: "20:00", value: 132 }, { label: "24:00", value: 118 },
];

const errors = [
  { label: "00:00", value: 4 }, { label: "04:00", value: 2 }, { label: "08:00", value: 9 },
  { label: "12:00", value: 21 }, { label: "16:00", value: 11 }, { label: "20:00", value: 6 }, { label: "24:00", value: 3 },
];

export default function PlatformObservability() {
  return (
    <div className="page-stack">
      <PageHeader title="Observability" description="Realtime latency, errors and throughput." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="P95 Latency" value="168ms" deltaLabel="-12ms vs avg" icon={Gauge} iconTone="primary" />
        <StatCard label="Error Rate" value="0.42%" delta={-0.1} icon={AlertTriangle} iconTone="warning" />
        <StatCard label="Throughput" value="3.2k rps" delta={4.1} icon={Activity} iconTone="success" />
        <StatCard label="Uptime" value="99.98%" deltaLabel="Last 30 days" icon={Server} iconTone="info" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">API Latency (P95)</CardTitle></CardHeader>
          <CardContent><LineChart data={latency} height={220} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">5xx Errors</CardTitle></CardHeader>
          <CardContent><LineChart data={errors} height={220} color="hsl(0 72% 51%)" /></CardContent>
        </Card>
      </div>
    </div>
  );
}

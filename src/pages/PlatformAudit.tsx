import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

interface Entry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  result: "Success" | "Failed";
  ip: string;
  time: string;
}

const entries: Entry[] = [
  { id: "A-1", actor: "nihala.nazar", action: "user.invite", resource: "U999 (test@example.com)", result: "Success", ip: "10.0.1.34", time: "2026-05-14 10:24" },
  { id: "A-2", actor: "marcus.lee", action: "ticket.escalate", resource: "T-1025", result: "Success", ip: "10.0.1.78", time: "2026-05-14 09:55" },
  { id: "A-3", actor: "system", action: "invoice.send", resource: "INV-2026-006", result: "Failed", ip: "internal", time: "2026-05-14 08:01" },
  { id: "A-4", actor: "sarah.chen", action: "customer.update", resource: "C001", result: "Success", ip: "10.0.1.12", time: "2026-05-13 16:34" },
  { id: "A-5", actor: "priya.patel", action: "customer.suspend", resource: "C004", result: "Success", ip: "10.0.1.45", time: "2026-05-13 11:12" },
];

export default function PlatformAudit() {
  const columns: Column<Entry>[] = [
    { key: "time", header: "Time", render: (e) => <span className="font-mono text-xs">{e.time}</span> },
    { key: "actor", header: "Actor", render: (e) => <span className="font-medium">{e.actor}</span> },
    { key: "action", header: "Action", render: (e) => <Badge variant="outline" className="font-mono text-[10px]">{e.action}</Badge> },
    { key: "resource", header: "Resource", render: (e) => <span className="text-muted-foreground">{e.resource}</span> },
    { key: "result", header: "Result", render: (e) => <StatusBadge status={e.result} /> },
    { key: "ip", header: "IP", render: (e) => <span className="text-xs text-muted-foreground font-mono">{e.ip}</span> },
  ];
  return (
    <div className="page-stack">
      <PageHeader title="Platform Audit" description="Every administrative action across the platform." />
      <Card>
        <DataTable columns={columns} data={entries} getRowKey={(e) => e.id} />
      </Card>
    </div>
  );
}

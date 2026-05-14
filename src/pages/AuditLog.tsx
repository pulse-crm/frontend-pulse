import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";
import { Input } from "@/components/ui/input/input";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { CardContent } from "@/components/ui/card/card";
import { Search } from "lucide-react";
import { useState } from "react";

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

const items: AuditEntry[] = [
  { id: "A-1", actor: "sarah.chen", action: "ticket.resolve", target: "T-1028", time: "2026-05-14 11:02" },
  { id: "A-2", actor: "marcus.lee", action: "ticket.escalate", target: "T-1025", time: "2026-05-14 09:55" },
  { id: "A-3", actor: "priya.patel", action: "customer.update", target: "C003", time: "2026-05-14 08:11" },
  { id: "A-4", actor: "system", action: "invoice.send", target: "INV-2026-002", time: "2026-05-14 07:00" },
  { id: "A-5", actor: "diego.alvarez", action: "deal.move", target: "D-006 → Negotiation", time: "2026-05-13 18:34" },
  { id: "A-6", actor: "nihala.nazar", action: "user.invite", target: "U999", time: "2026-05-13 16:22" },
];

export default function AuditLog() {
  const [query, setQuery] = useState("");
  const filtered = items.filter((i) =>
    !query || i.actor.toLowerCase().includes(query.toLowerCase()) ||
    i.action.toLowerCase().includes(query.toLowerCase()) ||
    i.target.toLowerCase().includes(query.toLowerCase())
  );
  const columns: Column<AuditEntry>[] = [
    { key: "time", header: "Time", render: (i) => <span className="font-mono text-xs">{i.time}</span> },
    { key: "actor", header: "Actor", render: (i) => <span className="font-medium">{i.actor}</span> },
    { key: "action", header: "Action", render: (i) => <Badge variant="outline" className="font-mono text-[10px]">{i.action}</Badge> },
    { key: "target", header: "Target", render: (i) => <span className="text-muted-foreground">{i.target}</span> },
  ];
  return (
    <div className="page-stack">
      <PageHeader title="Audit Log" description="Every user-facing change recorded for compliance." />
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search actor, action, or target…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <DataTable columns={columns} data={filtered} getRowKey={(i) => i.id} />
      </Card>
    </div>
  );
}

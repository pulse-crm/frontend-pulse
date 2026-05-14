import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Timer } from "lucide-react";
import { IconBox } from "@/components/ui/icon-box/icon-box";

interface Policy {
  id: string;
  name: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  firstResponse: string;
  resolution: string;
  active: boolean;
}

const policies: Policy[] = [
  { id: "S1", name: "Standard – Low", priority: "Low", firstResponse: "8h", resolution: "5d", active: true },
  { id: "S2", name: "Standard – Medium", priority: "Medium", firstResponse: "4h", resolution: "2d", active: true },
  { id: "S3", name: "Standard – High", priority: "High", firstResponse: "1h", resolution: "8h", active: true },
  { id: "S4", name: "Critical", priority: "Critical", firstResponse: "15m", resolution: "4h", active: true },
  { id: "S5", name: "Legacy – B2C", priority: "Medium", firstResponse: "12h", resolution: "5d", active: false },
];

export default function SlaPolicies() {
  const columns: Column<Policy>[] = [
    { key: "name", header: "Policy", render: (p) => <span className="font-medium">{p.name}</span> },
    { key: "priority", header: "Priority", render: (p) => <StatusBadge status={p.priority} /> },
    { key: "firstResponse", header: "First Response", render: (p) => <span className="font-mono text-xs">{p.firstResponse}</span> },
    { key: "resolution", header: "Resolution", render: (p) => <span className="font-mono text-xs">{p.resolution}</span> },
    { key: "active", header: "Status", render: (p) => <StatusBadge status={p.active ? "Active" : "Disabled"} tone={p.active ? "success" : "neutral"} /> },
  ];
  return (
    <div className="page-stack">
      <PageHeader
        title="SLA Policies"
        description="Define response and resolution targets across priorities."
        action={
          <Button>
            <Plus className="h-3.5 w-3.5" /> New policy
          </Button>
        }
      />
      <Card>
        <div className="p-5 flex items-center gap-3 border-b border-border">
          <IconBox icon={Timer} tone="primary" size="md" shape="square" />
          <div>
            <p className="font-semibold">5 policies configured</p>
            <p className="text-xs text-muted-foreground">4 active, 1 disabled</p>
          </div>
        </div>
        <DataTable columns={columns} data={policies} getRowKey={(p) => p.id} />
      </Card>
    </div>
  );
}

import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus } from "lucide-react";
import { users, type User } from "@/data/mock";

export default function PlatformIAM() {
  const columns: Column<User>[] = [
    { key: "id", header: "ID", render: (u) => <span className="font-mono text-xs">{u.id}</span> },
    {
      key: "name",
      header: "User",
      render: (u) => (
        <div>
          <p className="font-medium">{u.name}</p>
          <p className="text-xs text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (u) => <Badge variant="outline">{u.role}</Badge> },
    { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
    {
      key: "lastSeen",
      header: "Last Seen",
      render: (u) => <span className="text-xs text-muted-foreground">{u.lastSeen}</span>,
    },
  ];
  return (
    <div className="page-stack">
      <PageHeader
        title="Identity & Access"
        description="Manage roles, permissions and access for platform users."
        action={
          <Button>
            <Plus className="h-3.5 w-3.5" /> Invite user
          </Button>
        }
      />
      <Card>
        <DataTable columns={columns} data={users} getRowKey={(u) => u.id} />
      </Card>
    </div>
  );
}

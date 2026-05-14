import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { users, type User } from "@/data/mock";

export default function UserManagement() {
  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {u.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (u) => <Badge variant="outline">{u.role}</Badge> },
    { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
    { key: "lastSeen", header: "Last Seen", render: (u) => <span className="text-xs text-muted-foreground">{u.lastSeen}</span> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: () => (
        <Button variant="ghost" size="icon-sm" aria-label="More">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];
  return (
    <div className="page-stack">
      <PageHeader
        title="User Management"
        description="Members of your Pulse workspace."
        action={<Button><Plus className="h-3.5 w-3.5" /> Invite user</Button>}
      />
      <Card>
        <DataTable columns={columns} data={users} getRowKey={(u) => u.id} />
      </Card>
    </div>
  );
}

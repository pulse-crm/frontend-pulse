import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

interface Feedback {
  id: string;
  reporter: string;
  category: "Bug" | "Idea" | "Praise" | "Question";
  page: string;
  excerpt: string;
  status: "Open" | "Triaged" | "Resolved";
  time: string;
}

const items: Feedback[] = [
  { id: "F-12", reporter: "Sarah Chen", category: "Bug", page: "Pipeline", excerpt: "Cards lose order after refresh", status: "Triaged", time: "2h ago" },
  { id: "F-11", reporter: "Marcus Lee", category: "Idea", page: "Tickets", excerpt: "Filter by SLA breach risk", status: "Open", time: "5h ago" },
  { id: "F-10", reporter: "Priya Patel", category: "Praise", page: "Dashboard", excerpt: "Love the new churn breakdown!", status: "Resolved", time: "1d ago" },
  { id: "F-09", reporter: "Diego Alvarez", category: "Question", page: "Billing", excerpt: "How are pro-rata refunds calculated?", status: "Open", time: "2d ago" },
];

export default function FeedbackLog() {
  const columns: Column<Feedback>[] = [
    { key: "id", header: "ID", render: (f) => <span className="font-mono text-xs">{f.id}</span> },
    { key: "reporter", header: "Reporter", render: (f) => <span className="font-medium">{f.reporter}</span> },
    { key: "category", header: "Category", render: (f) => <StatusBadge status={f.category} /> },
    { key: "page", header: "Page", render: (f) => <Badge variant="outline">{f.page}</Badge> },
    { key: "excerpt", header: "Feedback", render: (f) => <span className="text-sm">{f.excerpt}</span> },
    { key: "status", header: "Status", render: (f) => <StatusBadge status={f.status} /> },
    { key: "time", header: "Time", render: (f) => <span className="text-xs text-muted-foreground">{f.time}</span> },
  ];
  return (
    <div className="page-stack">
      <PageHeader title="Feedback Log" description="What teammates have said about the platform recently." />
      <Card>
        <DataTable columns={columns} data={items} getRowKey={(f) => f.id} />
      </Card>
    </div>
  );
}

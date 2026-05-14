import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { IconBox } from "@/components/ui/icon-box/icon-box";
import { Search, BookOpen, Plus } from "lucide-react";

const articles = [
  { title: "How to provision a new fibre line", category: "Provisioning", views: 1284, updated: "2 days ago" },
  { title: "Troubleshooting slow speed complaints", category: "Performance", views: 3421, updated: "5 days ago" },
  { title: "Refund policy and SLA credits", category: "Billing", views: 982, updated: "1 week ago" },
  { title: "Escalating to NOC", category: "Process", views: 540, updated: "3 weeks ago" },
  { title: "Welcome scripts for new agents", category: "Training", views: 312, updated: "1 month ago" },
];

export default function KnowledgeBase() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Knowledge Base"
        description="Searchable articles, scripts, and runbooks for agents."
        action={<Button><Plus className="h-3.5 w-3.5" /> New article</Button>}
      />
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles…" className="pl-9" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {articles.map((a, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-start gap-3">
              <IconBox icon={BookOpen} tone="primary" size="md" shape="square" />
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-tight">{a.title}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                  <span>{a.views.toLocaleString()} views</span>
                  <span>·</span>
                  <span>Updated {a.updated}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

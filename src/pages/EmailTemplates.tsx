import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { IconBox } from "@/components/ui/icon-box/icon-box";
import { Mail, Plus, Edit, Copy } from "lucide-react";

const templates = [
  { name: "Welcome Email", channel: "Customer", lastUsed: "Today", active: true },
  { name: "Service Down Notification", channel: "Customer", lastUsed: "Yesterday", active: true },
  { name: "Invoice Overdue Reminder", channel: "Billing", lastUsed: "2 days ago", active: true },
  { name: "Renewal Confirmation", channel: "Customer", lastUsed: "1 week ago", active: true },
  { name: "Win-back Campaign", channel: "Marketing", lastUsed: "Never", active: false },
];

export default function EmailTemplates() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Email Templates"
        description="Reusable transactional and marketing email templates."
        action={<Button><Plus className="h-3.5 w-3.5" /> New template</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((t, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <IconBox icon={Mail} tone="primary" size="md" shape="square" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{t.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">{t.channel}</Badge>
                    <Badge tone={t.active ? "success" : "neutral"} className="text-[10px]">
                      {t.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last used: {t.lastUsed}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                <Button variant="outline" size="sm" className="flex-1"><Edit className="h-3.5 w-3.5" /> Edit</Button>
                <Button variant="ghost" size="sm"><Copy className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

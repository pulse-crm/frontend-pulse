import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge, type BadgeTone } from "@/components/ui/badge/badge";
import { Megaphone, Plus } from "lucide-react";

interface Announcement {
  title: string;
  body: string;
  audience: string;
  severity: "info" | "warning" | "destructive" | "success";
  date: string;
}

const items: Announcement[] = [
  { title: "Scheduled maintenance — Sunday 03:00", body: "Brief failover testing across EU-west region. Expect <30s blip on the API.", audience: "All", severity: "info", date: "2026-05-12" },
  { title: "New escalation policy live", body: "Critical network tickets now bypass L1 and route straight to NOC.", audience: "Agents", severity: "success", date: "2026-05-10" },
  { title: "Legacy SLA policy retiring", body: "The B2C legacy policy is now disabled. Migrate any custom rules referencing it.", audience: "Admins", severity: "warning", date: "2026-05-08" },
  { title: "Reminder: end-of-shift handover form", body: "Shift handover notes must be submitted by 17:30 daily.", audience: "Agents", severity: "info", date: "2026-05-06" },
];

const toneMap: Record<Announcement["severity"], BadgeTone> = {
  info: "info",
  warning: "warning",
  destructive: "destructive",
  success: "success",
};

export default function Announcements() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Announcements"
        description="Workspace-wide messages from administrators."
        action={<Button><Plus className="h-3.5 w-3.5" /> New announcement</Button>}
      />
      <div className="space-y-3">
        {items.map((a, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Megaphone className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{a.title}</p>
                  <Badge tone={toneMap[a.severity]}>{a.severity}</Badge>
                  <Badge variant="outline">{a.audience}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
                <p className="text-xs text-muted-foreground mt-2">{a.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

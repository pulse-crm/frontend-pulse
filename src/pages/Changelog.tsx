import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";

const entries = [
  {
    version: "Alpha 001",
    date: "Feb 2026",
    changes: [
      { tone: "success", label: "Feature", text: "Launched dashboard with CSAT, NPS, and churn analytics" },
      { tone: "success", label: "Feature", text: "Pipeline kanban board" },
      { tone: "info", label: "Improvement", text: "Reworked sidebar with collapsible groups" },
      { tone: "warning", label: "Fix", text: "Resolved race in messenger unread badge" },
    ],
  },
  {
    version: "Internal 0.9.2",
    date: "Jan 2026",
    changes: [
      { tone: "info", label: "Improvement", text: "Theme tokens unified across light and dark" },
      { tone: "warning", label: "Fix", text: "Fixed misaligned table headers on small screens" },
    ],
  },
  {
    version: "Internal 0.9.0",
    date: "Dec 2025",
    changes: [
      { tone: "success", label: "Feature", text: "First customer search prototype" },
    ],
  },
];

const toneMap: Record<string, "success" | "info" | "warning" | "destructive"> = {
  success: "success",
  info: "info",
  warning: "warning",
  destructive: "destructive",
};

export default function Changelog() {
  return (
    <div className="page-stack">
      <PageHeader title="Changelog" description="A running history of releases and notable changes." />
      <div className="space-y-4">
        {entries.map((e) => (
          <Card key={e.version}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{e.version}</h3>
                <span className="text-xs text-muted-foreground">{e.date}</span>
              </div>
              <ul className="space-y-2">
                {e.changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Badge tone={toneMap[c.tone] ?? "neutral"} className="shrink-0">{c.label}</Badge>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

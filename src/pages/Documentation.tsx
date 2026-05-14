import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { IconBox } from "@/components/ui/icon-box/icon-box";
import { HelpCircle, ExternalLink, BookOpen, Code, FileText } from "lucide-react";

const sections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: [
      "Quickstart for new agents",
      "Navigating the customer record",
      "Logging a ticket from a call",
    ],
  },
  {
    title: "Operations",
    icon: FileText,
    items: [
      "SLA policies explained",
      "Escalation paths",
      "Handover at end of shift",
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    items: [
      "Authentication",
      "Customer endpoints",
      "Webhook events",
    ],
  },
];

export default function Documentation() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Documentation"
        description="Guides, references, and runbooks for the Pulse platform."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <IconBox icon={s.icon} tone="primary" size="md" shape="square" />
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {s.items.map((i) => (
                  <li key={i}>
                    <a className="text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5" href="#">
                      <ExternalLink className="h-3 w-3" /> {i}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6 flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary shrink-0" />
          <p className="text-sm">Need something not covered here? Ping the Pulse engineering team in #pulse-support.</p>
        </CardContent>
      </Card>
    </div>
  );
}

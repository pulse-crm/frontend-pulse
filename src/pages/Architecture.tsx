import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Badge, type BadgeTone } from "@/components/ui/badge/badge";
import { IconBox, type IconBoxTone } from "@/components/ui/icon-box/icon-box";
import { Network, Database, Server, Cloud, Shield } from "lucide-react";

interface Layer {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  tech: string;
  tone: BadgeTone & IconBoxTone;
}

const layers: Layer[] = [
  { icon: Cloud, name: "Edge / CDN", tech: "Cloudflare", tone: "info" },
  { icon: Network, name: "App Frontend", tech: "React + Vite + Tailwind", tone: "primary" },
  { icon: Server, name: "API Gateway", tech: "Fastify · OpenAPI", tone: "primary" },
  { icon: Database, name: "Primary Database", tech: "Postgres 16", tone: "success" },
  { icon: Shield, name: "Identity", tech: "OIDC · SAML", tone: "warning" },
];

export default function Architecture() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Architecture"
        description="High-level system architecture and service dependencies."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {layers.map((l) => (
          <Card key={l.name}>
            <CardContent className="p-5 flex items-start gap-3">
              <IconBox icon={l.icon} tone={l.tone} size="md" shape="square" />
              <div>
                <p className="font-semibold">{l.name}</p>
                <Badge tone={l.tone} className="mt-1.5">{l.tech}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Pulse runs as a multi-region active/active deployment with stateless app workers backed by a primary Postgres
            cluster. Realtime updates flow through a websocket gateway powered by Redis pub/sub. CSAT and NPS aggregation
            lives in a separate analytics service that consumes the platform's event stream.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Shield, Activity, FileSearch, ArrowRight } from "lucide-react";
import { IconBox } from "@/components/ui/icon-box/icon-box";

const sections = [
  { title: "Identity & Access", description: "Roles, permissions, SSO", icon: Shield, to: "/platform/iam" },
  { title: "Audit Trail", description: "Inspect platform-wide actions", icon: FileSearch, to: "/platform/audit" },
  { title: "Observability", description: "Latency, errors, throughput", icon: Activity, to: "/platform/observability" },
];

export default function Platform() {
  return (
    <div className="page-stack">
      <PageHeader title="Platform" description="Platform-level tools for administrators." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="block">
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-5">
                <IconBox icon={s.icon} tone="primary" size="md" shape="square" className="mb-3" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

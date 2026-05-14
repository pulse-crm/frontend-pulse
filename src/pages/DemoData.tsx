import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { Database, RotateCcw, Trash2, Plus } from "lucide-react";
import { IconBox } from "@/components/ui/icon-box/icon-box";
import { toast } from "@/components/ui/toast/toaster";

const datasets = [
  { name: "Customers", count: 9, type: "demo" },
  { name: "Tickets", count: 6, type: "demo" },
  { name: "Invoices", count: 6, type: "demo" },
  { name: "Deals", count: 8, type: "demo" },
  { name: "Products", count: 6, type: "demo" },
  { name: "Users", count: 6, type: "demo" },
];

export default function DemoData() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Demo Data"
        description="Seed and reset sample records for demos and training."
        action={
          <Button onClick={() => toast({ title: "Demo data refreshed", variant: "success" })}>
            <RotateCcw className="h-3.5 w-3.5" /> Refresh all
          </Button>
        }
      />
      <Card>
        <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {datasets.map((d) => (
            <div key={d.name} className="border border-border rounded-md p-4 flex items-center gap-3">
              <IconBox icon={Database} tone="primary" size="md" shape="square" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.count.toLocaleString()} records</p>
              </div>
              <Badge variant="outline">{d.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5 flex items-center gap-3 flex-wrap">
          <Button variant="outline"><Plus className="h-3.5 w-3.5" /> Add fixture</Button>
          <Button variant="outline" onClick={() => toast({ title: "Demo data reseeded" })}>
            <RotateCcw className="h-3.5 w-3.5" /> Reseed
          </Button>
          <Button variant="destructive" onClick={() => toast({ title: "Demo data cleared", variant: "destructive" })}>
            <Trash2 className="h-3.5 w-3.5" /> Clear all
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

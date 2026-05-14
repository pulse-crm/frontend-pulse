import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Package } from "lucide-react";
import { products, type Product } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

export default function ProductCatalogue() {
  const columns: Column<Product>[] = [
    { key: "id", header: "SKU", render: (p) => <span className="font-mono text-xs font-medium">{p.id}</span> },
    {
      key: "name",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <Package className="h-4 w-4" />
          </div>
          <span className="font-medium">{p.name}</span>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (p) => <Badge variant="outline">{p.category}</Badge> },
    { key: "price", header: "Price", render: (p) => formatCurrency(p.price) },
    { key: "stock", header: "Stock", render: (p) => p.stock.toLocaleString() },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Product Catalogue"
        description="Manage all sellable products, SKUs, and pricing."
        action={<Button><Plus className="h-3.5 w-3.5" /> New product</Button>}
      />
      <Card>
        <DataTable columns={columns} data={products} getRowKey={(p) => p.id} />
      </Card>
    </div>
  );
}

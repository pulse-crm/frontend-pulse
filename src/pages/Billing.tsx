import * as React from "react";
import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs/tabs";
import { Progress } from "@/components/ui/progress/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { IconBox } from "@/components/ui/icon-box/icon-box";
import {
  Plus,
  Download,
  PoundSterling,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import { invoices, type Invoice, discounts, billingAdjustments, type BillingAdjustment } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function Billing() {
  const [adjSort, setAdjSort] = React.useState<"submittedAt" | "amount">("submittedAt");

  const paidTotal = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pendingTotal = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const overdueTotal = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const totalRevenue = paidTotal + pendingTotal + overdueTotal;

  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const pendingCount = invoices.filter((i) => i.status === "Pending").length;
  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;

  const collectionRate = totalRevenue > 0 ? ((paidTotal / totalRevenue) * 100).toFixed(1) : "0";
  const uniqueCustomerCount = new Set(invoices.map((i) => i.customer)).size;
  const overdueInvoices = invoices.filter((i) => i.status === "Overdue");

  const activeDiscounts = discounts.filter((d) => d.status === "Active");

  const sortedAdjustments = [...billingAdjustments].sort((a, b) => {
    if (adjSort === "amount") return b.amount - a.amount;
    return b.submittedAt.localeCompare(a.submittedAt);
  });
  const approvedAdj = billingAdjustments.filter((a) => a.status === "Approved");
  const pendingAdj = billingAdjustments.filter((a) => a.status === "Pending");
  const totalAdjAmount = billingAdjustments.reduce((s, a) => s + a.amount, 0);

  const invoiceColumns: Column<Invoice>[] = [
    { key: "id", header: "Invoice", render: (i) => <span className="font-mono text-xs font-medium">{i.id}</span> },
    { key: "customer", header: "Customer", render: (i) => <span className="font-medium">{i.customer}</span> },
    { key: "amount", header: "Amount", render: (i) => formatCurrency(i.amount, 2) },
    { key: "issueDate", header: "Issued", render: (i) => formatDate(i.issueDate) },
    { key: "dueDate", header: "Due", render: (i) => formatDate(i.dueDate) },
    { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: () => (
        <Button variant="ghost" size="sm">
          <Download className="h-3.5 w-3.5" /> PDF
        </Button>
      ),
    },
  ];

  const adjustmentColumns: Column<BillingAdjustment>[] = [
    { key: "id", header: "ID", render: (a) => <span className="font-mono text-xs">{a.id}</span> },
    { key: "customer", header: "Customer", render: (a) => <span className="font-medium">{a.customer}</span> },
    {
      key: "amount",
      header: "Amount",
      render: (a) => (
        <span className={cn("font-medium", a.amount < 0 ? "text-destructive" : "text-success")}>
          {a.amount < 0 ? "-" : "+"}{formatCurrency(Math.abs(a.amount))}
        </span>
      ),
    },
    { key: "reason", header: "Reason", render: (a) => <span className="text-sm">{a.reason}</span> },
    { key: "requestedBy", header: "By", render: (a) => <span className="text-xs text-muted-foreground">{a.requestedBy}</span> },
    { key: "submittedAt", header: "Submitted", render: (a) => <span className="text-xs text-muted-foreground">{a.submittedAt}</span> },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Billing & Payments"
        description="Invoices, collections, discounts and adjustments across your customer base."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button>
              <Plus className="h-3.5 w-3.5" /> New invoice
            </Button>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <IconBox icon={CheckCircle2} tone="success" size="md" shape="rounded" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Paid</p>
              <p className="text-2xl font-bold">{formatCurrency(paidTotal, 0)}</p>
              <p className="text-[10px] text-muted-foreground">{paidCount} invoices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <IconBox icon={Clock} tone="info" size="md" shape="rounded" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold">{formatCurrency(pendingTotal, 0)}</p>
              <p className="text-[10px] text-muted-foreground">{pendingCount} invoices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <IconBox icon={AlertTriangle} tone="danger" size="md" shape="rounded" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Overdue</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(overdueTotal, 0)}</p>
              <p className="text-[10px] text-muted-foreground">{overdueCount} invoices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">
            <Receipt className="h-3.5 w-3.5 mr-1.5" />
            Invoice Summary
          </TabsTrigger>
          <TabsTrigger value="collections">
            <PoundSterling className="h-3.5 w-3.5 mr-1.5" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="discounts">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            Discounts
          </TabsTrigger>
          <TabsTrigger value="adjustments">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Adjustments
          </TabsTrigger>
        </TabsList>

        {/* Invoice Summary */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Invoicing Overview</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Total Invoices</span>
                  <span className="font-bold text-lg">{invoices.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="font-bold text-lg">{formatCurrency(totalRevenue, 0)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Collection Rate</span>
                  <span className="font-bold text-lg text-success">{collectionRate}%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Active Customers</span>
                  <span className="font-bold text-lg">{uniqueCustomerCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Status Breakdown</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Paid</span>
                    <span className="font-medium">{paidCount} — {formatCurrency(paidTotal, 0)}</span>
                  </div>
                  <Progress value={totalRevenue > 0 ? (paidTotal / totalRevenue) * 100 : 0} tone="success" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-info" /> Pending</span>
                    <span className="font-medium">{pendingCount} — {formatCurrency(pendingTotal, 0)}</span>
                  </div>
                  <Progress value={totalRevenue > 0 ? (pendingTotal / totalRevenue) * 100 : 0} tone="primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Overdue</span>
                    <span className="font-medium">{overdueCount} — {formatCurrency(overdueTotal, 0)}</span>
                  </div>
                  <Progress value={totalRevenue > 0 ? (overdueTotal / totalRevenue) * 100 : 0} tone="destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">All Invoices</CardTitle></CardHeader>
            <DataTable columns={invoiceColumns} data={invoices} getRowKey={(i) => i.id} />
          </Card>
        </TabsContent>

        {/* Collections */}
        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Overdue Invoices ({overdueInvoices.length})</CardTitle>
              <p className="text-xs text-muted-foreground">
                Outstanding: <span className="font-semibold text-destructive">{formatCurrency(overdueTotal)}</span>
              </p>
            </CardHeader>
            <DataTable
              columns={invoiceColumns}
              data={overdueInvoices}
              getRowKey={(i) => i.id}
              emptyMessage="Nothing overdue 🎉"
            />
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Dunning Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Reminder emails sent", value: "184", desc: "Past 30 days" },
                { label: "Calls placed", value: "32", desc: "Past 30 days" },
                { label: "Suspensions issued", value: "4", desc: "Past 30 days" },
              ].map((d) => (
                <div key={d.label} className="rounded-md border border-border p-4">
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <p className="text-2xl font-bold mt-1">{d.value}</p>
                  <p className="text-[10px] text-muted-foreground">{d.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discounts */}
        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Discount Codes ({activeDiscounts.length} active)</CardTitle>
              <Button size="sm"><Plus className="h-3.5 w-3.5" /> New discount</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {discounts.map((d) => (
                  <div key={d.id} className="rounded-md border border-border p-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono font-bold bg-muted px-2 py-0.5 rounded">{d.code}</code>
                      <Badge tone={d.status === "Active" ? "success" : "neutral"}>{d.status}</Badge>
                    </div>
                    <p className="text-sm mt-2">{d.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>{d.type === "Percentage" ? `${d.value}% off` : `${formatCurrency(d.value)} off`}</span>
                      <span>{d.usedCount} uses · Exp {formatDate(d.expiresAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adjustments */}
        <TabsContent value="adjustments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Approved</p>
                <p className="text-2xl font-bold mt-1">{approvedAdj.length}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatCurrency(approvedAdj.reduce((s, a) => s + a.amount, 0))}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-bold mt-1">{pendingAdj.length}</p>
                <p className="text-[10px] text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Adjustment</p>
                <p className={cn("text-2xl font-bold mt-1", totalAdjAmount < 0 ? "text-destructive" : "text-success")}>
                  {formatCurrency(totalAdjAmount)}
                </p>
                <p className="text-[10px] text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Adjustment Audit</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant={adjSort === "submittedAt" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAdjSort("submittedAt")}
                >
                  By date
                </Button>
                <Button
                  variant={adjSort === "amount" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAdjSort("amount")}
                >
                  By amount
                </Button>
              </div>
            </CardHeader>
            <DataTable columns={adjustmentColumns} data={sortedAdjustments} getRowKey={(a) => a.id} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

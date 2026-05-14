import { Receipt, Download, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "@/components/ui/toast/toaster";
import type { Invoice } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";

interface InvoiceViewDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceViewDialog({ invoice, open, onOpenChange }: InvoiceViewDialogProps) {
  if (!invoice) return null;
  const lineNet = invoice.amount / 1.2;
  const tax = invoice.amount - lineNet;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Invoice {invoice.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 bg-muted/30">
            <div>
              <span className="text-xs text-muted-foreground">Customer</span>
              <p className="text-sm font-medium">{invoice.customer}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Status</span>
              <p className="mt-0.5"><StatusBadge status={invoice.status} /></p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Issue Date</span>
              <p className="text-sm font-medium">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Due Date</span>
              <p className="text-sm font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">Description</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-3 py-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 text-xs">Recurring services for billing period</td>
                  <td className="px-3 py-2 text-right font-mono text-xs">{formatCurrency(lineNet)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-xs text-muted-foreground">VAT (20%)</td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">{formatCurrency(tax)}</td>
                </tr>
                <tr className="bg-muted/30 font-semibold">
                  <td className="px-3 py-2 text-xs">Total</td>
                  <td className="px-3 py-2 text-right font-mono text-xs">{formatCurrency(invoice.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Download started", description: `${invoice.id}.pdf` })}
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
            <Button
              size="sm"
              onClick={() => toast({ title: "Sent", description: `${invoice.id} emailed to ${invoice.customer}.`, variant: "success" })}
            >
              <Send className="h-3.5 w-3.5" /> Send to Customer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

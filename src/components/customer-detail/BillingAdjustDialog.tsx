import * as React from "react";
import { Sliders, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Field } from "@/components/ui/field/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { toast } from "@/components/ui/toast/toaster";
import type { Invoice } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

interface BillingAdjustDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reasons = [
  "SLA credit for outage",
  "Goodwill credit",
  "Late delivery",
  "Pro-rata for downgrade",
  "Duplicate charge",
  "Billing error correction",
];

export function BillingAdjustDialog({ invoice, open, onOpenChange }: BillingAdjustDialogProps) {
  const [amount, setAmount] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setAmount("");
      setReason("");
      setNotes("");
    }
  }, [open]);

  if (!invoice) return null;

  const handleSubmit = () => {
    const value = Number(amount);
    if (!value || !reason) return;
    toast({
      title: "Adjustment submitted",
      description: `${formatCurrency(value)} credit on ${invoice.id} — sent for approval.`,
      variant: "success",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            Adjust Billing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border border-border p-3 bg-muted/30 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Invoice</span>
              <span className="font-mono">{invoice.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Original Amount</span>
              <span className="font-mono">{formatCurrency(invoice.amount)}</span>
            </div>
          </div>

          <Field label="Credit Amount (£)" required>
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>

          <Field label="Reason" required>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select a reason…" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Internal Notes" hint="Visible to billing reviewers only.">
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any context for the approver…"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" disabled={!amount || !reason} onClick={handleSubmit}>
              <Check className="h-3.5 w-3.5" /> Submit Adjustment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

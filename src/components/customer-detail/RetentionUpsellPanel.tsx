import * as React from "react";
import { Gift, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { CollapsiblePanel } from "./CollapsiblePanel";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { toast } from "@/components/ui/toast/toaster";
import type { Customer, Subscription } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

interface RetentionOffer {
  id: string;
  name: string;
  description: string;
  duration: string;
}

const retentionOffers: RetentionOffer[] = [
  { id: "RET01", name: "Loyalty Discount 15%", description: "15% off current plan", duration: "12 months" },
  { id: "RET02", name: "Free Speed Upgrade", description: "Next tier broadband", duration: "6 months" },
  { id: "RET03", name: "£50 Retention Credit", description: "Applied to next invoice", duration: "One-time" },
  { id: "RET04", name: "Free Add-on Bundle", description: "International calling pack", duration: "3 months" },
];

const upgradeSuggestions = [
  { id: "UP1", name: "Pulse Fibre 5Gbps", desc: "Next-tier bandwidth · Pro support", monthly: 119.99 },
  { id: "UP2", name: "Pulse Business Bundle", desc: "Fibre + Voice + Static IP", monthly: 149.99 },
  { id: "UP3", name: "Pulse Connect Plus", desc: "Cloud PBX + Mobile add-on", monthly: 174.99 },
];

interface RetentionUpsellPanelProps {
  customer: Customer;
  subscriptions: Subscription[];
}

export function RetentionUpsellPanel({ customer, subscriptions }: RetentionUpsellPanelProps) {
  const [appliedOffer, setAppliedOffer] = React.useState<string | null>(null);
  const monthlySpend = subscriptions.reduce((sum, s) => sum + s.monthly, 0);
  const isExpiring = customer.contractStatus === "Expiring Soon" || customer.contractStatus === "Expired";
  const count = isExpiring ? 1 : 0;

  return (
    <CollapsiblePanel title="Retention & Upsell" icon={Gift} count={count} defaultOpen={isExpiring}>
      <div className="p-3 space-y-3">
        {isExpiring ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/30">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
            <div className="text-xs">
              <span className="font-medium text-warning">
                Contract {customer.contractStatus === "Expired" ? "has expired" : "is expiring soon"}
              </span>
              <span className="text-muted-foreground"> — retention action recommended</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground p-2">
            No renewal action needed — contract is {customer.contractStatus.toLowerCase()}.
          </div>
        )}

        <div className="p-2 rounded-lg bg-accent/30">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Current Monthly Spend</p>
          <p className="text-lg font-bold">{formatCurrency(monthlySpend)}/mo</p>
          <p className="text-[10px] text-muted-foreground">{subscriptions.length} active services</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> Upgrade Paths
          </p>
          {upgradeSuggestions.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-2 rounded-md border border-border text-xs">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-[10px] text-muted-foreground">{u.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono font-medium">{formatCurrency(u.monthly)}/mo</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px]"
                  onClick={() => toast({ title: "Quote sent", description: `${u.name} quote queued for ${customer.name}.` })}
                >
                  Quote
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium flex items-center gap-1">
            <Gift className="h-3.5 w-3.5 text-primary" /> Retention Offers
          </p>
          {retentionOffers.map((offer) => (
            <div key={offer.id} className="flex items-center justify-between p-2 rounded-md border border-border text-xs">
              <div>
                <p className="font-medium">{offer.name}</p>
                <p className="text-[10px] text-muted-foreground">{offer.description} · {offer.duration}</p>
              </div>
              {appliedOffer === offer.id ? (
                <Badge variant="outline" className="text-[10px] bg-success/15 text-success border-success/30">
                  <CheckCircle2 className="h-3 w-3 mr-0.5" /> Applied
                </Badge>
              ) : (
                <Button
                  size="sm"
                  className="h-6 text-[10px]"
                  onClick={() => {
                    setAppliedOffer(offer.id);
                    toast({ title: "Offer applied", description: `${offer.name} applied to ${customer.name}.` });
                  }}
                >
                  Apply
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          className="w-full h-8 text-xs"
          onClick={() => toast({ title: "Renewal initiated", description: `Contract renewal started for ${customer.name}.` })}
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Initiate Contract Renewal
        </Button>
      </div>
    </CollapsiblePanel>
  );
}

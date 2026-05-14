import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  TicketPlus,
  CreditCard,
  ShoppingCart as ShoppingCartIcon,
  Mail,
  PauseCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { toast } from "@/components/ui/toast/toaster";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs/tabs";
import { CustomerHeaderCard } from "@/components/customer-detail/CustomerHeaderCard";
import { SubscriptionsPanel } from "@/components/customer-detail/SubscriptionsPanel";
import { TicketsPanel } from "@/components/customer-detail/TicketsPanel";
import { OrdersPanel } from "@/components/customer-detail/OrdersPanel";
import { InvoicesPanel } from "@/components/customer-detail/InvoicesPanel";
import { DevicesPanel } from "@/components/customer-detail/DevicesPanel";
import { InteractionHistoryPanel } from "@/components/customer-detail/InteractionHistoryPanel";
import { NotesPanel } from "@/components/customer-detail/NotesPanel";
import { CreditScoringPanel } from "@/components/customer-detail/CreditScoringPanel";
import { RetentionUpsellPanel } from "@/components/customer-detail/RetentionUpsellPanel";
import { CommunicationsPanel } from "@/components/customer-detail/CommunicationsPanel";
import { ActivityTimelinePanel } from "@/components/customer-detail/ActivityTimelinePanel";
import {
  customers,
  subscriptions,
  tickets,
  orders,
  invoices,
  devices,
  payments,
  interactions,
  notes,
} from "@/data/mock";
import { pushRecentCustomerId } from "@/lib/recent";
import { useCustomerTags } from "@/lib/tags";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = customers.find((c) => c.id === id);
  const { getTagsForCustomer } = useCustomerTags();

  React.useEffect(() => {
    if (customer) pushRecentCustomerId(customer.id);
  }, [customer]);

  if (!customer) {
    return (
      <div className="page-stack max-w-3xl mx-auto py-12 text-center">
        <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-semibold">Customer not found</h2>
        <p className="text-sm text-muted-foreground">
          We couldn't find a customer with id {id}.
        </p>
        <Button onClick={() => navigate("/")}>Back to customers</Button>
      </div>
    );
  }

  const custSubs = subscriptions.filter((s) => s.customerId === customer.id);
  const custTickets = tickets.filter((t) => t.customerId === customer.id);
  const custOrders = orders.filter((o) => o.customerId === customer.id);
  const custInvoices = invoices.filter((i) => i.customer === customer.name);
  const custDevices = devices.filter((d) => d.customerId === customer.id);
  const custPayments = payments.filter((p) => p.customerId === customer.id);
  const custInteractions = interactions.filter((i) => i.customerId === customer.id);
  const custNotes = notes.filter((n) => n.customerId === customer.id);

  const tags = getTagsForCustomer(customer.id);

  // Customer Value Score (0–100) — mirrors project-files calculation
  const monthlySpend = custSubs.reduce((sum, sub) => sum + sub.monthly, 0);
  const spendScore = Math.min(25, (monthlySpend / 200) * 25);
  const paymentScore = custPayments.length > 0 ? 25 : 12.5; // all mock payments are completed
  const creditScoreVal = Math.min(25, (customer.creditScore / 1000) * 25);
  const ticketScore = Math.max(0, 25 - custTickets.length * 5);
  const customerValueScore = Math.round(spendScore + paymentScore + creditScoreVal + ticketScore);
  const customerValueLabel =
    customerValueScore >= 80 ? "Platinum" : customerValueScore >= 60 ? "Gold" : customerValueScore >= 40 ? "Silver" : "Bronze";

  // Outstanding balance: unpaid invoices minus payments not yet allocated
  const unpaidTotal = custInvoices.filter((i) => i.status !== "Paid").reduce((sum, i) => sum + i.amount, 0);
  const paymentsTotal = custPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidTotal = custInvoices.filter((i) => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0);
  const outstandingBalance = unpaidTotal - Math.max(0, paymentsTotal - paidTotal);
  const creditLimit = customer.creditScore * 10;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to="/" className="whitespace-nowrap">
            <ArrowLeft className="h-4 w-4" /> Back to Search
          </Link>
        </Button>
        <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          onClick={() => toast({ title: "New Ticket", description: `Open a new ticket for ${customer.name}.` })}
        >
          <TicketPlus className="h-3.5 w-3.5" /> New Ticket
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast({ title: "Take Payment", description: `Processing payment for ${customer.name}…` })}
        >
          <CreditCard className="h-3.5 w-3.5" /> Take Payment
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast({ title: "New Order", description: `Creating order for ${customer.name}…` })}
        >
          <ShoppingCartIcon className="h-3.5 w-3.5" /> New Order
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast({ title: "Email", description: `Opening email to ${customer.email}` })}
        >
          <Mail className="h-3.5 w-3.5" /> Email
        </Button>
        {customer.status === "Active" && (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => toast({ title: "Suspend", description: `Suspension requested for ${customer.name}.`, variant: "destructive" })}
          >
            <PauseCircle className="h-3.5 w-3.5" /> Suspend
          </Button>
        )}
        </div>
      </div>

      <CustomerHeaderCard
        customer={customer}
        tags={tags}
        healthScore={customer.health}
        customerValue={customerValueScore}
        customerValueLabel={customerValueLabel}
        creditLimit={creditLimit}
        outstandingBalance={outstandingBalance}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({custTickets.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({custOrders.length})</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <SubscriptionsPanel data={custSubs} />
          <TicketsPanel data={custTickets} />
          <DevicesPanel data={custDevices} />
          <OrdersPanel data={custOrders} />
          <InvoicesPanel invoices={custInvoices} payments={custPayments} customerName={customer.name} />
          <RetentionUpsellPanel customer={customer} subscriptions={custSubs} />
          <CommunicationsPanel customer={customer} />
          <ActivityTimelinePanel
            interactions={custInteractions}
            payments={custPayments}
            orders={custOrders}
          />
          <InteractionHistoryPanel data={custInteractions} />
          <NotesPanel initial={custNotes} />
          <CreditScoringPanel customer={customer} invoices={custInvoices} payments={custPayments} outstandingBalance={outstandingBalance} />
        </TabsContent>

        <TabsContent value="services" className="space-y-3">
          <SubscriptionsPanel data={custSubs} />
          <DevicesPanel data={custDevices} />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-3">
          <TicketsPanel data={custTickets} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-3">
          <OrdersPanel data={custOrders} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-3">
          <InvoicesPanel invoices={custInvoices} payments={custPayments} customerName={customer.name} />
          <RetentionUpsellPanel customer={customer} subscriptions={custSubs} />
          <CreditScoringPanel customer={customer} invoices={custInvoices} payments={custPayments} outstandingBalance={outstandingBalance} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-3">
          <ActivityTimelinePanel
            interactions={custInteractions}
            payments={custPayments}
            orders={custOrders}
          />
          <InteractionHistoryPanel data={custInteractions} />
          <CommunicationsPanel customer={customer} />
          <NotesPanel initial={custNotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

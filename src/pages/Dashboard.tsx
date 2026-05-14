import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Ticket as TicketIcon,
  PoundSterling,
  AlertTriangle,
  Star,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  User,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs/tabs";
import { Progress } from "@/components/ui/progress/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { customers, tickets, invoices, revenueTrend, ticketVolume } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

const churnDataByPeriod = {
  weekly: [
    { name: "Bad Debt", value: 28 },
    { name: "Moved to Competitor", value: 34 },
    { name: "Relocated", value: 14 },
    { name: "Deceased/Closed", value: 6 },
    { name: "Unknown", value: 18 },
  ],
  monthly: [
    { name: "Bad Debt", value: 26 },
    { name: "Moved to Competitor", value: 35 },
    { name: "Relocated", value: 15 },
    { name: "Deceased/Closed", value: 7 },
    { name: "Unknown", value: 17 },
  ],
  yearly: [
    { name: "Bad Debt", value: 24 },
    { name: "Moved to Competitor", value: 38 },
    { name: "Relocated", value: 16 },
    { name: "Deceased/Closed", value: 8 },
    { name: "Unknown", value: 14 },
  ],
} as const;

const churnColors = [
  "hsl(0 72% 51%)",
  "hsl(25 90% 55%)",
  "hsl(45 85% 50%)",
  "hsl(270 50% 55%)",
  "hsl(200 15% 55%)",
];

const segmentData = [
  { segment: "Consumer", count: 1842000, pct: 89.4 },
  { segment: "SMB", count: 142000, pct: 6.9 },
  { segment: "Enterprise", count: 64000, pct: 3.1 },
  { segment: "Government", count: 12400, pct: 0.6 },
];

const customerGrowth = [
  { label: "Sep", value: 12400 },
  { label: "Oct", value: 14800 },
  { label: "Nov", value: 11200 },
  { label: "Dec", value: 8900 },
  { label: "Jan", value: 16200 },
  { label: "Feb", value: 13500 },
];

const sentimentData = [
  { name: "Positive", value: 62, color: "hsl(142 72% 40%)" },
  { name: "Neutral", value: 24, color: "hsl(45 85% 50%)" },
  { name: "Negative", value: 14, color: "hsl(0 72% 51%)" },
];

const topComplaintAreas = [
  { area: "Billing Accuracy", pct: 28 },
  { area: "Network Reliability", pct: 22 },
  { area: "Wait Times", pct: 18 },
  { area: "Speed Issues", pct: 15 },
  { area: "Provisioning Delays", pct: 12 },
  { area: "Other", pct: 5 },
];

const surveyChannelData = [
  { channel: "Post-Call IVR", responses: 24800, csat: 79 },
  { channel: "Email Survey", responses: 18200, csat: 82 },
  { channel: "In-App", responses: 31400, csat: 85 },
  { channel: "SMS", responses: 12600, csat: 76 },
  { channel: "Chat Post-Session", responses: 8900, csat: 88 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [churnPeriod, setChurnPeriod] = React.useState<keyof typeof churnDataByPeriod>("monthly");

  const activeCustomers = customers.filter((c) => c.status === "Active").length;
  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "Escalated").length;
  const overdueInvoices = invoices.filter((i) => i.status === "Overdue");
  const revenueMTD = invoices.filter((i) => i.issueDate.startsWith("2026-05")).reduce((s, i) => s + i.amount, 0);

  return (
    <div className="page-stack">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back. Here's your operational overview.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Subscribers"
          value={activeCustomers.toString()}
          delta={2.4}
          icon={Users}
          iconTone="primary"
          onClick={() => navigate("/")}
        />
        <StatCard
          label="Open Tickets"
          value={openTickets.toString()}
          deltaLabel="+5 today"
          icon={TicketIcon}
          iconTone="warning"
          onClick={() => navigate("/tickets")}
        />
        <StatCard
          label="Revenue MTD"
          value={formatCurrency(revenueMTD, 0)}
          deltaLabel="On track"
          icon={PoundSterling}
          iconTone="success"
          onClick={() => navigate("/billing")}
        />
        <StatCard
          label="Overdue Invoices"
          value={overdueInvoices.length.toString()}
          deltaLabel={`${formatCurrency(overdueInvoices.reduce((s, i) => s + i.amount, 0))} outstanding`}
          icon={AlertTriangle}
          iconTone="danger"
          onClick={() => navigate("/billing")}
        />
      </div>

      <Tabs defaultValue="customer-base" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customer-base">
            <Users className="h-3.5 w-3.5 mr-1.5" />Customer Base
          </TabsTrigger>
          <TabsTrigger value="agent-workload">
            <User className="h-3.5 w-3.5 mr-1.5" />Agent Workload
          </TabsTrigger>
          <TabsTrigger value="surveys-csat">
            <Star className="h-3.5 w-3.5 mr-1.5" />Surveys & CSAT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer-base" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Ticket Volume</CardTitle>
                <Badge variant="outline" className="text-[10px]">This Week</Badge>
              </CardHeader>
              <CardContent>
                <BarChart data={ticketVolume.map((t) => ({ label: t.label, value: t.count }))} height={180} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
                <Badge variant="outline" className="text-[10px]">Last 8 mo</Badge>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={revenueTrend.map((r) => ({ label: r.label, value: r.revenue / 1000 }))}
                  color="hsl(142 72% 40%)"
                  height={180}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Churn Breakdown</CardTitle>
                <div className="flex gap-1">
                  {(["weekly", "monthly", "yearly"] as const).map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={churnPeriod === p ? "default" : "outline"}
                      className="h-6 text-[10px] px-2 capitalize"
                      onClick={() => setChurnPeriod(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {churnDataByPeriod[churnPeriod].map((d, i) => (
                    <div key={d.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{d.name}</span>
                        <span className="text-muted-foreground">{d.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${d.value}%`, backgroundColor: churnColors[i] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Net Subscriber Growth</CardTitle></CardHeader>
              <CardContent>
                <BarChart data={customerGrowth} height={180} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Subscriber Segments</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {segmentData.map((s) => (
                    <div key={s.segment} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{s.segment}</span>
                        <span className="text-muted-foreground">{s.count.toLocaleString()} ({s.pct}%)</span>
                      </div>
                      <Progress value={Math.max(s.pct, 2)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agent-workload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Agent Capacity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Sarah Chen", role: "Senior Agent", load: 87, tickets: 14 },
                { name: "Marcus Lee", role: "Agent", load: 65, tickets: 9 },
                { name: "Priya Patel", role: "Agent", load: 42, tickets: 6 },
                { name: "Diego Alvarez", role: "Agent", load: 78, tickets: 12 },
                { name: "Nina Sokolova", role: "Admin", load: 22, tickets: 3 },
              ].map((agent) => (
                <div key={agent.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                    <span className="text-muted-foreground text-xs">{agent.tickets} tickets · {agent.load}%</span>
                  </div>
                  <Progress
                    value={agent.load}
                    tone={agent.load > 80 ? "destructive" : agent.load > 60 ? "warning" : "primary"}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveys-csat" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="CSAT Score" value="83%" delta={2} deltaLabel="+2pts vs last month" icon={ThumbsUp} iconTone="success" size="lg" />
            <StatCard label="NPS" value="+41" delta={3} deltaLabel="+3pts vs last month" icon={Star} iconTone="primary" size="lg" />
            <StatCard label="Survey Responses (MTD)" value="95.9K" delta={18} deltaLabel="18% response rate" icon={MessageSquare} iconTone="primary" size="lg" />
            <StatCard label="First Contact Resolution" value="72%" delta={-1} deltaLabel="-1pt vs last month" icon={CheckCircle2} iconTone="warning" size="lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Sentiment Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sentimentData.map((s) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium flex items-center gap-1.5">
                          {s.name === "Positive" && <Smile className="h-4 w-4 text-success" />}
                          {s.name === "Neutral" && <Meh className="h-4 w-4 text-warning" />}
                          {s.name === "Negative" && <Frown className="h-4 w-4 text-destructive" />}
                          {s.name}
                        </span>
                        <span className="text-muted-foreground">{s.value}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">CSAT by Channel</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {surveyChannelData.map((ch) => (
                    <div key={ch.channel} className="flex items-center justify-between text-sm gap-2">
                      <span className="font-medium truncate flex-1">{ch.channel}</span>
                      <span className="text-muted-foreground text-xs">{ch.responses.toLocaleString()}</span>
                      <Badge
                        tone={ch.csat >= 85 ? "success" : ch.csat >= 80 ? "info" : "warning"}
                        className="min-w-[48px] justify-center text-xs"
                      >
                        {ch.csat}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Complaint Areas</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {topComplaintAreas.map((c, i) => (
                    <div key={c.area} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{i + 1}. {c.area}</span>
                        <span className="text-muted-foreground">{c.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-destructive/70" style={{ width: `${c.pct * 3}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

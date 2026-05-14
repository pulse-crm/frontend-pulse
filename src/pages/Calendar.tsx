import * as React from "react";
import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface Event {
  date: number; // day of month
  title: string;
  tone: "primary" | "success" | "warning" | "danger";
}

const events: Event[] = [
  { date: 14, title: "Acme call", tone: "primary" },
  { date: 14, title: "SLA review", tone: "warning" },
  { date: 16, title: "Stark proposal due", tone: "danger" },
  { date: 19, title: "Globex onsite", tone: "success" },
  { date: 22, title: "Team retro", tone: "primary" },
];

const toneClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

export default function Calendar() {
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear] = React.useState(today.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("en-GB", { month: "long", year: "numeric" });

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else { setMonth(month - 1); }
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else { setMonth(month + 1); }
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="page-stack">
      <PageHeader
        title="Calendar"
        description="Plan tasks, follow-ups, and customer commitments."
        action={<Button><Plus className="h-3.5 w-3.5" /> New event</Button>}
      />
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{monthName}</h3>
            <div className="flex gap-1">
              <Button size="icon-sm" variant="outline" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="icon-sm" variant="outline" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-md overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground p-2 text-center">{d}</div>
            ))}
            {cells.map((d, i) => {
              const dayEvents = d ? events.filter((e) => e.date === d) : [];
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div
                  key={i}
                  className={cn(
                    "bg-card min-h-[88px] p-1.5 text-xs",
                    isToday && "ring-2 ring-primary ring-inset"
                  )}
                >
                  {d && (
                    <>
                      <span className={cn("inline-block font-medium mb-1", isToday && "text-primary")}>{d}</span>
                      <div className="space-y-1">
                        {dayEvents.map((e, ei) => (
                          <Badge
                            key={ei}
                            className={cn("block truncate text-[10px] py-0", toneClasses[e.tone])}
                            variant="outline"
                          >
                            {e.title}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Progress } from "@/components/ui/progress/progress";
import { Star, ThumbsUp, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button/button";

const surveys = [
  { name: "Post-Call CSAT", responses: 24800, score: 79 },
  { name: "Email Pulse Check", responses: 18200, score: 82 },
  { name: "In-App NPS", responses: 31400, score: 85 },
  { name: "Quarterly Account Review", responses: 1284, score: 88 },
];

export default function Surveys() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Surveys & CSAT"
        description="Track customer satisfaction, sentiment, and feedback across channels."
        action={<Button><Plus className="h-3.5 w-3.5" /> New survey</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Avg CSAT" value="83%" delta={2} icon={ThumbsUp} iconTone="success" />
        <StatCard label="NPS" value="+41" delta={3} icon={Star} iconTone="primary" />
        <StatCard label="Responses (MTD)" value="95.9K" deltaLabel="18% response rate" icon={MessageSquare} iconTone="info" />
        <StatCard label="Active Surveys" value="4" deltaLabel="Across 5 channels" icon={Star} iconTone="warning" />
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Survey Performance</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {surveys.map((s) => (
            <div key={s.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium">{s.name}</p>
                <span className="text-xs text-muted-foreground">{s.responses.toLocaleString()} responses · {s.score}%</span>
              </div>
              <Progress value={s.score} tone={s.score >= 85 ? "success" : s.score >= 75 ? "primary" : "warning"} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

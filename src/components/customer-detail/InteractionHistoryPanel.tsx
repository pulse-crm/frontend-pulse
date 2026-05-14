import { History } from "lucide-react";
import { CollapsiblePanel } from "./CollapsiblePanel";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Interaction } from "@/data/mock";

/**
 * `channel` doubles as the "type" badge so the colour matches the rest of the
 * status system (Phone/Email/Chat/Portal/SMS/In-Store are all in statusToneMap).
 */
const channelDirection: Record<Interaction["channel"], "↓ In" | "↑ Out"> = {
  Phone: "↓ In",
  Email: "↑ Out",
  Chat: "↓ In",
  Portal: "↓ In",
  SMS: "↑ Out",
  "In-Store": "↓ In",
};

export function InteractionHistoryPanel({ data }: { data: Interaction[] }) {
  const columns: Column<Interaction>[] = [
    { key: "channel", header: "Type", render: (i) => <StatusBadge status={i.channel} /> },
    {
      key: "direction",
      header: "Dir",
      render: (i) => <span className="text-xs text-muted-foreground">{channelDirection[i.channel]}</span>,
    },
    { key: "summary", header: "Subject", render: (i) => <span className="font-medium">{i.summary}</span> },
    { key: "agent", header: "Agent", render: (i) => <span className="text-xs text-muted-foreground">{i.agent}</span> },
  ];

  return (
    <CollapsiblePanel title="Interaction History" icon={History} count={data.length} defaultOpen={false}>
      <DataTable columns={columns} data={data} getRowKey={(i) => i.id} emptyMessage="No interactions logged." />
    </CollapsiblePanel>
  );
}

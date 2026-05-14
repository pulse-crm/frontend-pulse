import * as React from "react";
import { Smartphone } from "lucide-react";
import { CollapsiblePanel } from "./CollapsiblePanel";
import { DataTable, type Column } from "@/components/ui/table/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeviceManagementDialog } from "./DeviceManagementDialog";
import type { Device } from "@/data/mock";

export function DevicesPanel({ data }: { data: Device[] }) {
  const [selected, setSelected] = React.useState<Device | null>(null);
  const [open, setOpen] = React.useState(false);

  const columns: Column<Device>[] = [
    {
      key: "device",
      header: "Device",
      render: (d) => (
        <span className="font-medium text-primary underline-offset-2 hover:underline">{d.name}</span>
      ),
    },
    { key: "type", header: "Type", render: (d) => <span className="text-xs">{d.type}</span> },
    { key: "status", header: "Status", render: (d) => <StatusBadge status={d.status} /> },
    {
      key: "firmware",
      header: "Firmware",
      render: (d) => <span className="font-mono text-xs">{d.firmware}</span>,
    },
    {
      key: "lastSeen",
      header: "Last Seen",
      render: (d) => <span className="text-xs text-muted-foreground">{d.lastSeen}</span>,
    },
  ];

  return (
    <>
      <CollapsiblePanel title="Device Management" icon={Smartphone} count={data.length}>
        <DataTable
          columns={columns}
          data={data}
          getRowKey={(d) => d.id}
          emptyMessage="No devices"
          onRowClick={(d) => {
            setSelected(d);
            setOpen(true);
          }}
        />
      </CollapsiblePanel>
      <DeviceManagementDialog device={selected} open={open} onOpenChange={setOpen} />
    </>
  );
}

import {
  Cpu,
  Monitor,
  RefreshCw,
  Zap,
  Wifi,
  Network,
  Shield,
  XCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "@/components/ui/toast/toaster";
import type { Device } from "@/data/mock";

interface DeviceManagementDialogProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DataGrid({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 bg-muted/30">
      {rows.map((r) => (
        <div key={r.label}>
          <span className="text-xs text-muted-foreground">{r.label}</span>
          <p className="text-sm font-medium">{r.value}</p>
        </div>
      ))}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {title}
      </h4>
      {children}
    </div>
  );
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = Math.min(100, Math.round((value / total) * 100));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium">
          {value} / {total} devices
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Synthetic numbers for telemetry — pulse mock doesn't carry them, but they make
// the demo look complete. Stable per device via the serial number.
function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

export function DeviceManagementDialog({ device, open, onOpenChange }: DeviceManagementDialogProps) {
  if (!device) return null;

  const isRouter = device.type === "Router" || device.type === "Modem";
  const seed = hash(device.serialNumber);
  const downSpeed = 800 + (seed % 700); // 800-1500 Mbps
  const upSpeed = 80 + (seed % 120); // 80-200 Mbps
  const latency = 4 + (seed % 8); // 4-12 ms
  const devices2g = 1 + (seed % 4); // 1-4
  const devices5g = 3 + ((seed >> 2) % 6); // 3-8

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Device Management — {device.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <Section icon={Monitor} title="Product Information">
            <DataGrid
              rows={[
                { label: "Make", value: "Pulse Networks" },
                { label: "Model", value: device.name.replace("Pulse ", "") },
                { label: "Type", value: device.type },
                { label: "Serial Number", value: <span className="font-mono">{device.serialNumber}</span> },
                { label: "Assigned Service", value: "Fibre Broadband" },
                { label: "Warranty Expiry", value: "2027-08-14" },
                { label: "Status", value: <StatusBadge status={device.status} /> },
                ...(device.ipAddress
                  ? [{ label: "IP Address", value: <span className="font-mono">{device.ipAddress}</span> }]
                  : []),
              ]}
            />
          </Section>

          <Section icon={RefreshCw} title="Firmware">
            <DataGrid
              rows={[
                { label: "Current Firmware", value: <span className="font-mono">{device.firmware}</span> },
                { label: "Latest Available", value: <span className="font-mono">v4.3.0-stable</span> },
                { label: "Last Updated", value: "2026-01-12 03:22" },
                { label: "Auto-Update", value: "Enabled (maintenance window)" },
              ]}
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: "Checking for updates", description: `${device.name} is up to date.` })}
              >
                <RefreshCw className="h-3 w-3" /> Check for Update
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: "Update queued", description: `${device.name} will update at next window.` })}
              >
                <Zap className="h-3 w-3" /> Push Update
              </Button>
            </div>
          </Section>

          {isRouter && (
            <>
              <Section icon={Wifi} title="In-Home Telemetry">
                <div className="space-y-3">
                  <div className="rounded-lg border border-border p-3 bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Connection Status</span>
                      <StatusBadge status={device.status === "Online" ? "Online" : "Offline"} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Uptime</span>
                        <p className="text-sm font-medium">14d 7h 32m</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Last Reboot</span>
                        <p className="text-sm font-medium">2026-04-29</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">WAN IP</span>
                        <p className="text-sm font-medium font-mono">82.12.45.198</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-3 bg-muted/30 space-y-2">
                    <span className="text-xs font-medium block">Wi-Fi Performance</span>
                    <Bar label="2.4 GHz Band" value={devices2g} total={6} />
                    <Bar label="5 GHz Band" value={devices5g} total={10} />
                  </div>

                  <div className="rounded-lg border border-border p-3 bg-muted/30">
                    <span className="text-xs font-medium block mb-2">Line Statistics</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Download Speed</span>
                        <p className="text-sm font-medium font-mono">{downSpeed} Mbps</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Upload Speed</span>
                        <p className="text-sm font-medium font-mono">{upSpeed} Mbps</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Latency</span>
                        <p className="text-sm font-medium font-mono">{latency} ms</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">SNR Margin</span>
                        <p className="text-sm font-medium font-mono">18.4 / 12.1 dB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </>
          )}

          <div className="flex gap-2 pt-3 border-t border-border">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast({ title: "Reboot queued", description: `${device.name} will reboot.` })}
            >
              <RefreshCw className="h-3 w-3" /> Reboot Device
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast({ title: "Diagnostics running", description: "Results will appear shortly." })}
            >
              <Shield className="h-3 w-3" /> Run Diagnostics
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast({ title: "Speed test started" })}
            >
              <Network className="h-3 w-3" /> Speed Test
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="ml-auto"
              onClick={() => toast({ title: "Fault reported", description: `Ticket created for ${device.name}.`, variant: "destructive" })}
            >
              <XCircle className="h-3 w-3" /> Report Fault
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

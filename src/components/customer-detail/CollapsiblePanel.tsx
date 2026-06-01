import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card";
import { cn } from "@/lib/cn";

/** Uniform card height when open — every panel is the same fixed size and its
 *  body scrolls internally if the content is taller. A closed panel collapses
 *  to just its header, independently of any neighbouring card. */
const OPEN_HEIGHT = "h-80";

interface CollapsiblePanelProps {
  title: string;
  icon: React.ElementType;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function CollapsiblePanel({
  title,
  icon: Icon,
  count,
  defaultOpen = true,
  children,
  action,
}: CollapsiblePanelProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Card className={cn("flex flex-col", open && OPEN_HEIGHT)}>
      <CardHeader
        className="p-3 cursor-pointer hover:bg-accent/50 transition-colors shrink-0"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            {title}
            {count !== undefined && (
              <span className="text-xs text-muted-foreground font-normal">({count})</span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {action && <span onClick={(e) => e.stopPropagation()}>{action}</span>}
            {open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {open && <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto">{children}</CardContent>}
    </Card>
  );
}

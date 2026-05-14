import * as React from "react";
import { cn } from "@/lib/cn";

type Side = "bottom" | "top" | "left" | "right";
type Align = "start" | "center" | "end";

interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: Side;
  align?: Align;
  width?: number;
  className?: string;
}

const sideClasses: Record<Side, string> = {
  bottom: "top-full mt-2",
  top: "bottom-full mb-2",
  left: "right-full mr-2 top-0",
  right: "left-full ml-2 top-0",
};

const alignClasses: Record<Side, Record<Align, string>> = {
  bottom: { start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0" },
  top: { start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0" },
  left: { start: "top-0", center: "top-1/2 -translate-y-1/2", end: "bottom-0" },
  right: { start: "top-0", center: "top-1/2 -translate-y-1/2", end: "bottom-0" },
};

export function Popover({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  trigger,
  children,
  side = "bottom",
  align = "start",
  width,
  className,
}: PopoverProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : internal;
  const setOpen = (v: boolean) => {
    if (!isControlled) setInternal(v);
    onOpenChange?.(v);
  };
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const id = window.setTimeout(() => {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      <div
        onClick={(e) => {
          // Toggle on the click that wasn't inside the panel
          if (wrapperRef.current && wrapperRef.current.contains(e.target as Node)) {
            // Only toggle if the click happened on the trigger itself (first child)
            const triggerEl = wrapperRef.current.firstElementChild;
            if (triggerEl && triggerEl.contains(e.target as Node)) {
              setOpen(!open);
            }
          }
        }}
      >
        {trigger}
      </div>
      {open && (
        <div
          role="dialog"
          style={width ? { width } : undefined}
          className={cn(
            "absolute z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-lg animate-scale-in",
            sideClasses[side],
            alignClasses[side][align],
            !width && "w-80",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

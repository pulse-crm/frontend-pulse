import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { NotificationsCentre } from "@/components/NotificationsCentre";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-4 h-14 px-6 border-b border-border bg-card shrink-0">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search… (⌘K)"
          className="pl-9 pr-12 cursor-pointer"
          size="sm"
          readOnly
          onClick={() =>
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
          }
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle variant="icon" />
        <NotificationsCentre />
        <Button size="sm" onClick={() => navigate("/pipeline")}>
          <Plus className="h-3.5 w-3.5" />
          New deal
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}

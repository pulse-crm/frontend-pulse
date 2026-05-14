import * as React from "react";
import {
  Send,
  Search,
  Plus,
  Paperclip,
  Smile,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Hash,
  Star,
  Circle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Button } from "@/components/ui/button/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs/tabs";
import { Badge } from "@/components/ui/badge/badge";
import { cn } from "@/lib/cn";
import { users } from "@/data/mock";

interface DM {
  id: string;
  type: "dm";
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread?: number;
  online?: boolean;
}

interface Channel {
  id: string;
  type: "channel";
  name: string;
  preview: string;
  time: string;
  unread?: number;
  members: number;
}

type Convo = DM | Channel;

const dms: DM[] = [
  { id: "c1", type: "dm", name: "Sarah Chen", initials: "SC", preview: "Got it — I'll pick up the Globex ticket.", time: "2m", unread: 2, online: true },
  { id: "c2", type: "dm", name: "Marcus Lee", initials: "ML", preview: "Sent proposal v2 to Stark Industries.", time: "1h", online: true },
  { id: "c3", type: "dm", name: "Priya Patel", initials: "PP", preview: "Can someone cover Initech provisioning?", time: "3h", unread: 1, online: false },
  { id: "c4", type: "dm", name: "Diego Alvarez", initials: "DA", preview: "On a customer call, BRB.", time: "1d", online: false },
  { id: "c5", type: "dm", name: "Nina Sokolova", initials: "NS", preview: "I'll merge the platform PR after lunch.", time: "1d", online: true },
];

const channels: Channel[] = [
  { id: "ch1", type: "channel", name: "support-noc", preview: "Marcus: New maintenance window draft", time: "12m", unread: 5, members: 18 },
  { id: "ch2", type: "channel", name: "enterprise-accounts", preview: "Sarah: Stark renewal moved forward", time: "1h", members: 8 },
  { id: "ch3", type: "channel", name: "billing-team", preview: "Priya: ADJ-1045 ready to approve", time: "3h", unread: 1, members: 5 },
  { id: "ch4", type: "channel", name: "general", preview: "Welcome to PulseGS 👋", time: "1d", members: 42 },
];

interface Message {
  from: "me" | "them";
  author?: string;
  text: string;
  time: string;
}

const initialMessages: Record<string, Message[]> = {
  c1: [
    { from: "them", author: "Sarah Chen", text: "Hey — did you see the Globex outage ticket?", time: "09:01" },
    { from: "me", text: "Yes, just assigned it to you. Critical priority.", time: "09:02" },
    { from: "them", author: "Sarah Chen", text: "Got it — I'll pick up the Globex ticket.", time: "09:04" },
    { from: "them", author: "Sarah Chen", text: "ETA ~30 mins once I'm on the bridge with NOC.", time: "09:05" },
  ],
  c2: [
    { from: "them", author: "Marcus Lee", text: "Sent proposal v2 to Stark Industries.", time: "08:21" },
    { from: "me", text: "Awesome — let me know if they push back on the SLA.", time: "08:23" },
  ],
  ch1: [
    { from: "them", author: "Marcus Lee", text: "Heads up — possible BGP flap in eu-west.", time: "10:12" },
    { from: "them", author: "Diego Alvarez", text: "Looking now. Restoring on backup peer.", time: "10:14" },
    { from: "me", text: "Thanks team. Keep me posted.", time: "10:16" },
  ],
};

export default function Messages() {
  const [tab, setTab] = React.useState<"dms" | "channels">("dms");
  const [activeId, setActiveId] = React.useState("c1");
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState(initialMessages);
  const [search, setSearch] = React.useState("");

  const conversations: Convo[] = tab === "dms" ? dms : channels;
  const filtered = conversations.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );
  const active = [...dms, ...channels].find((c) => c.id === activeId) ?? dms[0];
  const thread = messages[activeId] ?? [];

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] ?? []),
        {
          from: "me",
          text: draft,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }));
    setDraft("");
  };

  return (
    <div className="page-stack flex flex-col">
      <PageHeader title="Messages" description="Direct messages and shared channels for your team." />

      <Card className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] overflow-hidden min-h-[560px]">
        {/* Left rail */}
        <div className="border-r border-border flex flex-col bg-muted/20">
          <div className="p-3 border-b border-border space-y-2">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "dms" | "channels")}>
              <TabsList className="w-full">
                <TabsTrigger value="dms" className="flex-1">
                  <Star className="h-3.5 w-3.5 mr-1" /> DMs
                </TabsTrigger>
                <TabsTrigger value="channels" className="flex-1">
                  <Hash className="h-3.5 w-3.5 mr-1" /> Channels
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dms" />
              <TabsContent value="channels" />
            </Tabs>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={tab === "dms" ? "Search teammates" : "Search channels"}
                className="pl-8"
                size="sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "w-full px-3 py-2.5 flex items-start gap-2.5 text-left hover:bg-muted/50 transition-colors border-b border-border/40",
                  activeId === c.id && "bg-muted/70"
                )}
              >
                {c.type === "dm" ? (
                  <div className="relative shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{c.initials}</AvatarFallback>
                    </Avatar>
                    {c.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
                    )}
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Hash className="h-4 w-4" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{c.type === "channel" ? `#${c.name}` : c.name}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
                </div>
                {c.unread && (
                  <span className="bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5 font-semibold shrink-0">{c.unread}</span>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">No results</p>
            )}
          </div>

          <div className="p-2 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full">
              <Plus className="h-3.5 w-3.5" /> New {tab === "dms" ? "message" : "channel"}
            </Button>
          </div>
        </div>

        {/* Main thread */}
        <div className="flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2.5">
            {active.type === "dm" ? (
              <>
                <div className="relative">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{active.initials}</AvatarFallback>
                  </Avatar>
                  {active.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{active.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Circle className={cn("h-2 w-2", active.online ? "fill-success text-success" : "fill-muted text-muted")} />
                    {active.online ? "Active now" : "Offline"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Hash className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">#{active.name}</p>
                  <p className="text-xs text-muted-foreground">{active.members} members</p>
                </div>
              </>
            )}
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Call"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Video"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Info"><Info className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="More"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            {thread.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center">No messages yet — say hi.</p>
            ) : (
              thread.map((m, i) => {
                const prev = thread[i - 1];
                const showAuthor = m.from === "them" && (!prev || prev.from !== "them" || prev.author !== m.author);
                return (
                  <div key={i} className={cn("flex flex-col", m.from === "me" ? "items-end" : "items-start")}>
                    {showAuthor && m.author && (
                      <span className="text-[10px] text-muted-foreground mb-0.5 ml-1">{m.author}</span>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                        m.from === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <p className={cn("text-[10px] mt-1", m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {m.time}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            {active.type === "dm" && active.online && (
              <div className="flex items-end gap-1.5 text-[10px] text-muted-foreground">
                <span className="inline-flex gap-0.5 items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:240ms]" />
                </span>
                {active.name} is typing…
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon-sm" aria-label="Attach"><Paperclip className="h-4 w-4" /></Button>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder={active.type === "dm" ? `Message ${active.name}` : `Message #${active.name}`}
                className="min-h-[40px] resize-none flex-1"
              />
              <Button variant="ghost" size="icon-sm" aria-label="Emoji"><Smile className="h-4 w-4" /></Button>
              <Button onClick={send} disabled={!draft.trim()} size="icon"><Send className="h-4 w-4" /></Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Enter to send, Shift+Enter for new line · {users.filter((u) => u.status === "Online").length} teammates online
            </p>
          </div>
        </div>
      </Card>

      {/* Online roster */}
      <Card>
        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Online now</p>
          <div className="flex flex-wrap gap-2">
            {users
              .filter((u) => u.status === "Online")
              .map((u) => (
                <Badge key={u.id} variant="outline" className="gap-1.5 px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {u.name}
                </Badge>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

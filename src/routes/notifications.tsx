import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Vijaya" }] }),
  component: Notifications,
});

type Notif = { id: string; text: string; time: string; read: boolean };

const MOCK: Notif[] = [
  { id:"n1", text:"Your drawing 'My Happy Garden' was selected for Top 30 in Issue 47! 🌟", time:"2h ago", read:false },
  { id:"n2", text:"New review on your story 'The Moon's Secret'.", time:"5h ago", read:false },
  { id:"n3", text:"You've been named a Top 3 Contributor for Issue 46! 🏆", time:"1d ago", read:false },
  { id:"n4", text:"Admin edited your drawing 'Rainbow Bridge'.", time:"2d ago", read:true },
  { id:"n5", text:"Issue 47 deadline is in 12 days — don't forget to submit!", time:"3d ago", read:true },
  { id:"n6", text:"Someone congratulated you! 🎉", time:"4d ago", read:true },
];

function Notifications() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [notifs, setNotifs] = useState(MOCK);

  useEffect(() => {
    if (!getSession()) nav({ to: "/login" });
  }, [nav]);

  const markAll = () => {
    setNotifs(p => p.map(n => ({ ...n, read: true })));
    toast.success("All marked as read ✓");
  };

  const toggle = (id: string) =>
    setNotifs(p => p.map(n => n.id === id ? { ...n, read: !n.read } : n));

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-4xl font-bold">
            <Bell className="h-7 w-7 text-primary" /> {t("dashboard.notifications")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread` : "You're all caught up! ✨"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" className="rounded-full" onClick={markAll}>
            <Check className="mr-1 h-4 w-4" /> {t("dashboard.markAllRead")}
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {notifs.map(n => (
          <button
            key={n.id}
            onClick={() => toggle(n.id)}
            className={`flex w-full items-start justify-between gap-3 rounded-2xl border p-4 text-left transition hover:shadow-sm
              ${n.read ? "border-border/60 bg-card" : "border-primary/30 bg-primary/5 shadow-playful"}`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${n.read ? "bg-border" : "bg-primary"}`} />
              <span className="text-sm">{n.text}</span>
            </div>
            <span className="flex-shrink-0 text-xs text-muted-foreground">{n.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

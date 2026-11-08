import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, Bell, Sparkles, Pencil, Trash2, Star, BookOpen, Image } from "lucide-react";
import { getSession, clearSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { drawings, stories } from "@/lib/mock-data";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Vijaya" }] }),
  component: Dashboard,
});

type Tab = "drawings" | "stories" | "notifications";

const mockNotifs = [
  { id:"n1", text:"Your drawing 'My Happy Garden' was selected for Top 30 in Issue 47! 🌟", time:"2h", read:false },
  { id:"n2", text:"New review on your story 'The Brave Lion'.", time:"5h", read:false },
  { id:"n3", text:"Issue 47 deadline is in 12 days.", time:"1d", read:true },
  { id:"n4", text:"Welcome to Vijaya — submit your first piece for Issue 47!", time:"3d", read:true },
];

function StatusBadge({ top30 }: { top30: boolean }) {
  const { t } = useTranslation();
  if (top30) return <span className="rounded-full bg-sunshine/60 px-2 py-0.5 text-xs font-bold text-sunshine-foreground">{t("dashboard.status.top30")}</span>;
  return <span className="rounded-full bg-mint/40 px-2 py-0.5 text-xs font-semibold text-teal-700">{t("dashboard.status.live")}</span>;
}

function Dashboard() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [tab, setTab] = useState<Tab>("drawings");
  const [notifs, setNotifs] = useState(mockNotifs);

  useEffect(() => {
    const session = getSession();
    if (!session) { nav({ to: "/login" }); return; }
    setUser(session);
  }, [nav]);

  const logout = () => { clearSession(); nav({ to: "/" }); };
  const markAllRead = () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); toast.success("All notifications marked as read"); };

  const unreadCount = notifs.filter(n => !n.read).length;

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-playful mb-8">
        <div>
          <div className="text-sm text-muted-foreground">{t("dashboard.welcome")}</div>
          <h1 className="font-display text-3xl font-bold">{user.name}</h1>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="rounded-full"><Link to="/submit/drawing"><Sparkles className="mr-1 h-4 w-4" /> {t("nav.submit")}</Link></Button>
          <Button asChild variant="outline" className="rounded-full"><Link to="/profile">Edit profile</Link></Button>
          <Button variant="outline" className="rounded-full text-destructive" onClick={logout}><LogOut className="mr-1 h-4 w-4" /> {t("nav.logout")}</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-full border border-border overflow-hidden mb-6 w-fit">
        {([
          { id: "drawings", icon: <Image className="h-3.5 w-3.5" />, label: t("dashboard.myDrawings") },
          { id: "stories", icon: <BookOpen className="h-3.5 w-3.5" />, label: t("dashboard.myStories") },
          { id: "notifications", icon: <Bell className="h-3.5 w-3.5" />, label: `${t("dashboard.notifications")}${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
        ] as const).map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition ${tab === tb.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {/* Drawings tab */}
      {tab === "drawings" && (
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drawings.slice(0, 6).map(d => (
              <div key={d.id} className="rounded-2xl border border-border/60 bg-card overflow-hidden card-lift">
                <div className="relative">
                  <img src={d.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                  <div className="absolute top-2 left-2"><StatusBadge top30={d.top30} /></div>
                </div>
                <div className="p-3">
                  <div className="font-display font-bold">{d.title}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{d.issue}</span>
                    <EmojiRatingDisplay rating={d.rating} count={d.reviewCount} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 rounded-full h-7 text-xs" onClick={() => toast.info("Edit coming soon")}><Pencil className="mr-1 h-3 w-3" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="flex-1 rounded-full h-7 text-xs text-destructive hover:bg-destructive/10" onClick={() => toast.success("Drawing deleted")}><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/submit/drawing" className="card-lift rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center hover:border-primary/40 transition-colors min-h-[200px]">
              <div className="text-4xl mb-2">🎨</div>
              <div className="font-display font-bold">{t("dashboard.noSubs")}</div>
              <div className="text-sm text-primary mt-1">{t("dashboard.submitNow")}</div>
            </Link>
          </div>
        </section>
      )}

      {/* Stories tab */}
      {tab === "stories" && (
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.slice(0, 4).map(s => (
              <div key={s.id} className="rounded-2xl border border-border/60 bg-card p-4 card-lift">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="rounded-full bg-sunshine/50 px-2 py-0.5 text-xs font-semibold">{s.type}</span>
                  <StatusBadge top30={s.top30} />
                </div>
                <div className="font-display text-lg font-bold">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.excerpt}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.issue}</span>
                  <EmojiRatingDisplay rating={s.rating} count={s.reviewCount} />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-full h-7 text-xs" onClick={() => toast.info("Edit coming soon")}><Pencil className="mr-1 h-3 w-3" /> Edit</Button>
                  <Button size="sm" variant="ghost" className="flex-1 rounded-full h-7 text-xs text-destructive hover:bg-destructive/10" onClick={() => toast.success("Deleted")}><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                </div>
              </div>
            ))}
            <Link to="/submit/story" className="card-lift rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center hover:border-primary/40 transition-colors">
              <div className="text-4xl mb-2">✍️</div>
              <div className="font-display font-bold">{t("dashboard.noSubs")}</div>
              <div className="text-sm text-primary mt-1">{t("dashboard.submitNow")}</div>
            </Link>
          </div>
        </section>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <section>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" className="rounded-full" onClick={markAllRead}>{t("dashboard.markAllRead")}</Button>
          </div>
          {notifs.length === 0
            ? <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">{t("dashboard.noNotifications")}</div>
            : (
              <div className="space-y-3">
                {notifs.map(n => (
                  <div key={n.id} className={`flex items-start justify-between gap-3 rounded-2xl border p-4 transition-all ${!n.read ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card"}`}>
                    <div className="flex items-start gap-3">
                      {!n.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                      <div className="text-sm">{n.text}</div>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">{n.time}</div>
                  </div>
                ))}
              </div>
            )
          }
        </section>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BookOpen, Flag, Star, Users, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { drawings, stories } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/overview")({
  head: () => ({ meta: [{ title: "Overview — Admin" }] }),
  component: AdminOverview,
});

function StatCard({ icon, label, value, sub, color, bg }: {
  icon: React.ReactNode; label: string; value: number | string; sub?: string; color: string; bg: string;
}) {
  return (
    <div className="card-lift rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
      <div className="flex items-center gap-3 mb-4">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl ${bg}`}>{icon}</div>
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      </div>
      <div className={`font-display text-4xl font-bold ${color}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function AdminOverview() {
  const { t } = useTranslation();
  const pending = drawings.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero banner — same gradient style as user home */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-cherry p-8 text-primary-foreground shadow-playful">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest mb-3">
            ✦ Editor's Desk
          </div>
          <h1 className="font-display text-4xl font-bold">{t("admin.title")}</h1>
          <p className="mt-2 max-w-xl opacity-90 text-sm">{t("admin.lead")}</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/10" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<BookOpen className="h-5 w-5 text-primary-foreground" />} label={t("admin.pending")} value={12} sub="awaiting approval" color="text-primary" bg="bg-primary" />
        <StatCard icon={<Flag className="h-5 w-5 text-white" />} label={t("admin.flagged")} value={2} sub="reviews flagged" color="text-cherry" bg="bg-cherry" />
        <StatCard icon={<Star className="h-5 w-5 text-sunshine-foreground" />} label="Active issue" value="Issue 47" sub="12 days remaining" color="text-sunshine-foreground" bg="bg-sunshine" />
        <StatCard icon={<Users className="h-5 w-5 text-white" />} label={t("admin.totalUsers")} value={284} sub="+12 this week" color="text-teal-700" bg="bg-mint" />
      </div>

      {/* Two column panels — same rounded card style as user pages */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending queue */}
        <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-playful">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-secondary/30">
            <h2 className="font-display text-lg font-bold">{t("admin.pending")}</h2>
            <Link to="/admin/drawings" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {pending.map(d => (
              <div key={d.id} className="flex items-center gap-3 px-6 py-3">
                <img src={d.imageUrl} alt="" className="h-10 w-10 rounded-xl object-cover flex-shrink-0 border border-border/60" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm line-clamp-1">{d.title}</div>
                  <div className="text-xs text-muted-foreground">{d.firstName}, age {d.age}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="rounded-full bg-mint/40 px-3 py-1 text-xs font-bold text-teal-700 hover:bg-mint/60 transition">✓ Approve</button>
                  <button className="rounded-full bg-cherry/20 px-3 py-1 text-xs font-bold text-cherry hover:bg-cherry/30 transition">✗</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress panel */}
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
          <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Issue 47 progress
          </h2>
          <div className="space-y-4">
            {[
              { label: "Drawings submitted", value: drawings.length, max: 30, color: "bg-primary" },
              { label: "Stories & poems", value: stories.length, max: 30, color: "bg-cherry" },
              { label: "Top 30 drawings selected", value: drawings.filter(d=>d.top30).length, max: 30, color: "bg-sunshine" },
              { label: "Top 30 stories selected", value: stories.filter(s=>s.top30).length, max: 30, color: "bg-mint" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{s.label}</span>
                  <span className="font-bold text-muted-foreground">{s.value} / {s.max}</span>
                </div>
                <div className="h-2.5 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all`}
                    style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-sunshine/20 border border-sunshine/40 p-4 text-sm">
            <Clock className="h-4 w-4 text-sunshine-foreground flex-shrink-0" />
            <div>
              <span className="font-semibold">Deadline in 12 days</span>
              <span className="text-muted-foreground ml-1">— Issue 47 closes June 15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links grid — same style as CTA cards on home */}
      <div>
        <h2 className="font-display text-xl font-bold mb-4">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/admin/top30", emoji: "⭐", label: "Manage Top 30", desc: "Select the best work" },
            { to: "/admin/top3", emoji: "🏆", label: "Confirm Top 3", desc: "Choose contributors" },
            { to: "/admin/builder", emoji: "📖", label: "Build Magazine", desc: "Layout the issue" },
            { to: "/admin/users", emoji: "👥", label: "Manage Users", desc: "Review accounts" },
          ].map(q => (
            <Link
              key={q.to}
              to={q.to}
              className="card-lift flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 hover:border-primary/40 transition-all"
            >
              <span className="text-2xl">{q.emoji}</span>
              <div>
                <div className="font-display font-bold text-sm">{q.label}</div>
                <div className="text-xs text-muted-foreground">{q.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { topContributors } from "@/lib/mock-data";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/top3")({
  head: () => ({ meta: [{ title: "Top 3 Selection — Admin" }] }),
  component: AdminTop3,
});

type Pool = "5-8" | "9-12" | "13-17";

const POOLS: { pool: Pool; label: string; idx: number; insufficient: boolean }[] = [
  { pool: "5-8",   label: "Ages 5 – 8",   idx: 0, insufficient: false },
  { pool: "9-12",  label: "Ages 9 – 12",  idx: 1, insufficient: false },
  { pool: "13-17", label: "Ages 13 – 17", idx: 2, insufficient: true  },
];

const RANK_STYLES = [
  { gradient: "from-yellow-400 to-primary",   trophy: "text-yellow-300", label: "#1 Contributor" },
  { gradient: "from-slate-300 to-slate-500",  trophy: "text-slate-200",  label: "#2 Contributor" },
  { gradient: "from-amber-600 to-amber-800",  trophy: "text-amber-300",  label: "#3 Contributor" },
];

function AdminTop3() {
  const { t } = useTranslation();
  const [confirmed, setConfirmed] = useState<Record<Pool, boolean>>({ "5-8": false, "9-12": false, "13-17": false });
  const allDone = Object.values(confirmed).every(Boolean);

  const confirmAll = () => {
    setConfirmed({ "5-8": true, "9-12": true, "13-17": true });
    toast.success("All Top 3 confirmed! Notifications sent to winners. 🏆");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.top3.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review system suggestions per age group, then confirm your final picks.
          </p>
        </div>
        <Button className="rounded-full shadow-playful" onClick={confirmAll} disabled={allDone}>
          <Trophy className="mr-2 h-4 w-4" />
          {allDone ? "All confirmed ✓" : t("admin.top3.confirmAll")}
        </Button>
      </div>

      {/* Age pool cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {POOLS.map(({ pool, label, idx, insufficient }) => {
          const contributor = topContributors[idx];
          const isConfirmed = confirmed[pool];
          const style = RANK_STYLES[idx];

          return (
            <div key={pool} className={`card-lift rounded-3xl border-2 overflow-hidden shadow-playful transition-all
              ${isConfirmed ? "border-primary" : "border-border/60"}`}>

              {/* Gradient header — mirrors Top 3 public page */}
              <div className={`relative bg-gradient-to-br ${style.gradient} p-5`}>
                <Trophy className={`h-10 w-10 ${style.trophy} drop-shadow`} />
                <div className="mt-1 font-display text-lg font-bold text-white drop-shadow">{label}</div>
                <div className="mt-0.5 text-xs text-white/80">{style.label}</div>
                {isConfirmed && (
                  <div className="absolute top-3 right-3 rounded-full bg-white/20 p-1.5">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="p-5">
                {/* Insufficient data warning */}
                {insufficient && (
                  <div className="mb-4 flex items-start gap-2 rounded-2xl bg-sunshine/25 border border-sunshine/40 p-3 text-xs">
                    <AlertTriangle className="h-4 w-4 text-sunshine-foreground flex-shrink-0 mt-0.5" />
                    <span>{t("admin.top3.insufficientData")} Suggestion based on available data.</span>
                  </div>
                )}

                {/* Suggested contributor */}
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("admin.top3.suggested")}
                </div>
                <div className="rounded-2xl bg-secondary/40 p-4 mb-4">
                  <img src={contributor.highlightImg} alt="" className="w-full h-28 object-cover rounded-xl mb-3" />
                  <div className="font-display font-bold text-base">{contributor.name}</div>
                  <div className="text-xs text-muted-foreground">{contributor.school}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <EmojiRatingDisplay rating={contributor.rating} count={0} />
                    <span className="text-xs font-semibold text-muted-foreground">
                      Score: <span className="text-foreground">{contributor.rating.toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 rounded-full h-9"
                    variant={isConfirmed ? "outline" : "default"}
                    onClick={() => {
                      setConfirmed(c => ({ ...c, [pool]: true }));
                      toast.success(`${label} contributor confirmed! 🎉`);
                    }}
                    disabled={isConfirmed}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    {isConfirmed ? "Confirmed" : t("admin.top3.accept")}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full h-9 px-3"
                    onClick={() => toast.info("Override: pick a different user from User Management")}
                    title={t("admin.top3.override")}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

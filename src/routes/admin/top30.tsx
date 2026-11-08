import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { drawings, stories } from "@/lib/mock-data";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/top30")({
  head: () => ({ meta: [{ title: "Top 30 — Admin" }] }),
  component: AdminTop30,
});

function AdminTop30() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"drawings" | "stories">("drawings");
  const [selDrawings, setSelDrawings] = useState<Set<string>>(
    new Set(drawings.filter(d => d.top30).map(d => d.id))
  );
  const [selStories, setSelStories] = useState<Set<string>>(
    new Set(stories.filter(s => s.top30).map(s => s.id))
  );

  const sorted = {
    drawings: [...drawings].sort((a, b) => b.rating - a.rating),
    stories:  [...stories].sort((a, b) => b.rating - a.rating),
  };

  const toggleD = (id: string) => setSelDrawings(prev => {
    const n = new Set(prev);
    if (n.has(id)) { n.delete(id); return n; }
    if (n.size >= 30) { toast.error("Maximum 30 drawings"); return prev; }
    n.add(id); return n;
  });
  const toggleS = (id: string) => setSelStories(prev => {
    const n = new Set(prev);
    if (n.has(id)) { n.delete(id); return n; }
    if (n.size >= 30) { toast.error("Maximum 30 stories"); return prev; }
    n.add(id); return n;
  });

  const confirm = () => toast.success("Top 30 confirmed! Notifications sent to all selected contributors. 🌟");

  const insufficient = tab === "drawings"
    ? sorted.drawings.filter(d => d.rating >= 3).length < 30
    : sorted.stories.filter(s => s.rating >= 3).length < 30;

  const currentSel = tab === "drawings" ? selDrawings : selStories;
  const currentItems = tab === "drawings" ? sorted.drawings : sorted.stories;
  const toggle = tab === "drawings" ? toggleD : toggleS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.top30.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Click a card to select or deselect it for the Top 30
          </p>
        </div>
        <Button className="rounded-full shadow-playful" onClick={confirm}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> {t("admin.top30.confirmTop30")}
        </Button>
      </div>

      {/* Tabs — same pill style as site */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-full border border-border overflow-hidden shadow-playful">
          {(["drawings", "stories"] as const).map(tb => (
            <button key={tb} onClick={() => setTab(tb)}
              className={`px-5 py-2 text-sm font-semibold transition ${tab === tb ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              {tb === "drawings"
                ? `🎨 ${t("admin.top30.drawingsTab")} (${selDrawings.size}/30)`
                : `📝 ${t("admin.top30.storiesTab")} (${selStories.size}/30)`}
            </button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-bold text-primary">{currentSel.size}</span> / 30 selected
        </div>
      </div>

      {/* Insufficient data warning */}
      {insufficient && (
        <div className="flex items-center gap-3 rounded-2xl bg-sunshine/25 border border-sunshine/50 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 text-sunshine-foreground flex-shrink-0" />
          <span>{t("admin.top30.flagWarning")}</span>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentItems.map((item, i) => {
          const sel = currentSel.has(item.id);
          const isDrawing = "imageUrl" in item;
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`card-lift text-left rounded-3xl border-2 overflow-hidden transition-all
                ${sel ? "border-primary shadow-playful scale-[1.02]" : "border-border/60 bg-card hover:border-primary/30"}`}
            >
              {/* Rank badge */}
              {isDrawing ? (
                <div className="relative">
                  <img src={(item as any).imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                  <div className="absolute top-2 left-2 h-7 w-7 rounded-full bg-black/60 text-white text-xs font-bold grid place-items-center shadow">
                    #{i + 1}
                  </div>
                  {sel && (
                    <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-playful">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-4 ${sel ? "bg-primary/5" : "bg-secondary/30"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-muted-foreground/40">#{i+1}</span>
                    {sel && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <span className="rounded-full bg-sunshine/40 px-2 py-0.5 text-xs font-bold">
                    {(item as any).type}
                  </span>
                </div>
              )}

              <div className="p-3">
                <div className="font-display font-bold text-sm line-clamp-1">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {isDrawing ? (item as any).firstName : (item as any).author}
                  {isDrawing && ` · ${(item as any).school}`}
                </div>
                <div className="mt-2">
                  <EmojiRatingDisplay rating={item.rating} count={item.reviewCount} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

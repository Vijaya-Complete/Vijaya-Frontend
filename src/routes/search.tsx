import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DrawingCard } from "@/components/DrawingCard";
import { drawings, stories } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import { EmojiRatingDisplay } from "@/components/EmojiRating";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — Vijaya" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all"|"drawings"|"stories">("all");
  const [issue, setIssue] = useState("all");
  const [age, setAge] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredDrawings = useMemo(() => {
    if (!q.trim()) return drawings;
    const ql = q.toLowerCase();
    return drawings.filter(d =>
      d.title.toLowerCase().includes(ql) ||
      d.firstName.toLowerCase().includes(ql) ||
      d.school.toLowerCase().includes(ql)
    ).filter(d => issue === "all" || d.issue === issue)
     .filter(d => age === "all" || d.ageGroup === age)
     .filter(d => d.rating >= minRating);
  }, [q, issue, age, minRating]);

  const filteredStories = useMemo(() => {
    if (!q.trim()) return stories;
    const ql = q.toLowerCase();
    return stories.filter(s =>
      s.title.toLowerCase().includes(ql) ||
      s.author.toLowerCase().includes(ql) ||
      s.excerpt.toLowerCase().includes(ql)
    ).filter(s => issue === "all" || s.issue === issue)
     .filter(s => s.rating >= minRating);
  }, [q, issue, minRating]);

  const clearFilters = () => { setIssue("all"); setAge("all"); setMinRating(0); };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-6">{t("search.title")}</h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={t("search.placeholder")}
          className="pl-12 pr-4 py-3 rounded-full text-base"
        />
        {q && <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex rounded-full border border-border overflow-hidden">
          {(["all","drawings","stories"] as const).map(t2 => (
            <button key={t2} onClick={() => setTab(t2)} className={`px-4 py-1.5 text-sm font-semibold transition ${tab === t2 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              {t2 === "all" ? t("search.tabs.all") : t2 === "drawings" ? t("search.tabs.drawings") : t("search.tabs.stories")}
            </button>
          ))}
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => setShowFilters(f => !f)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" /> {t("search.filters")}
        </Button>
        {(issue !== "all" || age !== "all" || minRating > 0) && (
          <Button variant="ghost" className="rounded-full text-muted-foreground" onClick={clearFilters}>
            <X className="mr-1 h-3.5 w-3.5" /> {t("search.clearFilters")}
          </Button>
        )}
        {q && <span className="text-sm text-muted-foreground">{filteredDrawings.length + filteredStories.length} {t("search.results")} "{q}"</span>}
      </div>

      {showFilters && (
        <div className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-border/60 bg-card p-4">
          <Select value={issue} onValueChange={setIssue}>
            <SelectTrigger className="w-36 rounded-full"><SelectValue placeholder={t("gallery.filterIssue")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("gallery.all")}</SelectItem>
              {["Issue 46","Issue 45","Issue 44"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={age} onValueChange={setAge}>
            <SelectTrigger className="w-36 rounded-full"><SelectValue placeholder={t("gallery.filterAge")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("gallery.all")}</SelectItem>
              <SelectItem value="5-8">{t("gallery.ages5_8")}</SelectItem>
              <SelectItem value="9-12">{t("gallery.ages9_12")}</SelectItem>
              <SelectItem value="13-17">{t("gallery.ages13_17")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <span className="text-sm">{t("search.ratingMin")}:</span>
            {[0,1,2,3,4].map(r => (
              <button key={r} onClick={() => setMinRating(r)} className={`text-lg transition ${r < minRating ? "opacity-30" : ""}`}>
                {r < minRating ? "⭐" : "⭐"}
              </button>
            ))}
          </div>
        </div>
      )}

      {(tab === "all" || tab === "drawings") && (
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold mb-4">{t("search.tabs.drawings")}</h2>
          {filteredDrawings.length === 0
            ? <p className="text-muted-foreground">{t("search.noResults")}</p>
            : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredDrawings.map(d => <DrawingCard key={d.id} d={d} />)}</div>
          }
        </div>
      )}

      {(tab === "all" || tab === "stories") && (
        <div>
          <h2 className="font-display text-xl font-bold mb-4">{t("search.tabs.stories")}</h2>
          {filteredStories.length === 0
            ? <p className="text-muted-foreground">{t("search.noResults")}</p>
            : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStories.map(s => (
                  <Link key={s.id} to="/stories/$id" params={{ id: s.id }} className="card-lift rounded-2xl border border-border/60 bg-card p-5">
                    <span className="rounded-full bg-sunshine/60 px-2 py-0.5 text-xs font-semibold text-sunshine-foreground">{s.type}</span>
                    <div className="mt-2 font-display text-lg font-bold leading-tight">{s.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.excerpt}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{s.issue}</span>
                      <EmojiRatingDisplay rating={s.rating} count={s.reviewCount} />
                    </div>
                  </Link>
                ))}
              </div>
          }
        </div>
      )}
    </div>
  );
}

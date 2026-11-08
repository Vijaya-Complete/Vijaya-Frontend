import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { stories, type Story } from "@/lib/mock-data";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Stories & Poems — Vijaya" },
      { name: "description", content: "Read poems, short stories and articles written by children, in English, Sinhala and Tamil." },
    ],
  }),
  component: StoriesPage,
});

const TYPES: Array<"all" | Story["type"]> = ["all", "Poem", "Short Story", "Article", "Other"];

function StoriesPage() {
  const { t } = useTranslation();
  const [type, setType] = useState<"all" | Story["type"]>("all");
  const [sort, setSort] = useState<"newest" | "rated">("newest");
  const [top30Only, setTop30Only] = useState(false);

  const items = useMemo(() => {
    let list = [...stories];
    if (type !== "all") list = list.filter((s) => s.type === type);
    if (top30Only) list = list.filter((s) => s.top30);
    list.sort((a, b) => (sort === "rated" ? b.rating - a.rating : 0));
    return list;
  }, [type, sort, top30Only]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t("gallery.storiesTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("gallery.storiesSubtitle")}</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 px-1 text-sm font-semibold text-muted-foreground">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger className="w-[160px] rounded-full"><SelectValue placeholder={t("gallery.filterType")} /></SelectTrigger>
          <SelectContent>
            {TYPES.map((tp) => (
              <SelectItem key={tp} value={tp}>{tp === "all" ? t("gallery.all") : tp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "rated")}>
          <SelectTrigger className="w-[160px] rounded-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("gallery.sortNewest")}</SelectItem>
            <SelectItem value="rated">{t("gallery.sortRated")}</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={top30Only ? "default" : "outline"}
          onClick={() => setTop30Only((v) => !v)}
          className="rounded-full"
        >
          {t("gallery.top30")}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <div className="text-5xl">📖</div>
          <p className="mt-3 font-display text-lg font-semibold">{t("gallery.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Link
              key={s.id}
              to="/stories/$id"
              params={{ id: s.id }}
              className="card-lift relative flex flex-col rounded-3xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-sunshine/50 px-2.5 py-1 text-xs font-semibold text-sunshine-foreground">{s.type}</span>
                {s.top30 && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Top 30</span>}
              </div>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight">{s.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-3">{s.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <div className="text-xs text-muted-foreground">
                  by <span className="font-semibold text-foreground">{s.author}</span> · {s.issue}
                </div>
                <EmojiRatingDisplay rating={s.rating} count={s.reviewCount} />
              </div>
              {s.isPdf && (
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" /> PDF
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

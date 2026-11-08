import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DrawingCard } from "@/components/DrawingCard";
import { drawings, type AgeGroup } from "@/lib/mock-data";

export const Route = createFileRoute("/drawings")({
  head: () => ({
    meta: [
      { title: "Drawings Gallery — Vijaya" },
      { name: "description", content: "Browse drawings submitted by young artists across Vijaya magazine issues." },
    ],
    links: [{ rel: "canonical", href: "/drawings" }],
  }),
  component: GalleryPage,
});

const ISSUES = ["all", "Issue 46", "Issue 45", "Issue 44"];

function GalleryPage() {
  const { t } = useTranslation();
  const [issue, setIssue] = useState("all");
  const [age, setAge] = useState<"all" | AgeGroup>("all");
  const [sort, setSort] = useState<"newest" | "rated">("newest");
  const [top30Only, setTop30Only] = useState(false);

  const items = useMemo(() => {
    let list = [...drawings];
    if (issue !== "all") list = list.filter((d) => d.issue === issue);
    if (age !== "all") list = list.filter((d) => d.ageGroup === age);
    if (top30Only) list = list.filter((d) => d.top30);
    list.sort((a, b) =>
      sort === "rated" ? b.rating - a.rating : +new Date(b.date) - +new Date(a.date)
    );
    return list;
  }, [issue, age, sort, top30Only]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t("gallery.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("gallery.subtitle")}</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 px-1 text-sm font-semibold text-muted-foreground">
          <Filter className="h-4 w-4" /> Filters
        </div>

        <Select value={issue} onValueChange={setIssue}>
          <SelectTrigger className="w-[140px] rounded-full">
            <SelectValue placeholder={t("gallery.filterIssue")} />
          </SelectTrigger>
          <SelectContent>
            {ISSUES.map((i) => (
              <SelectItem key={i} value={i}>
                {i === "all" ? t("gallery.all") : i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={age} onValueChange={(v) => setAge(v as AgeGroup | "all")}>
          <SelectTrigger className="w-[140px] rounded-full">
            <SelectValue placeholder={t("gallery.filterAge")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("gallery.all")}</SelectItem>
            <SelectItem value="5-8">{t("gallery.ages5_8")}</SelectItem>
            <SelectItem value="9-12">{t("gallery.ages9_12")}</SelectItem>
            <SelectItem value="13-17">{t("gallery.ages13_17")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "rated")}>
          <SelectTrigger className="w-[160px] rounded-full">
            <SelectValue />
          </SelectTrigger>
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
          <div className="text-5xl">🎨</div>
          <p className="mt-3 font-display text-lg font-semibold">{t("gallery.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((d) => <DrawingCard key={d.id} d={d} />)}
        </div>
      )}
    </div>
  );
}

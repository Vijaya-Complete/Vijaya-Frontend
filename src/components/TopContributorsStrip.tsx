import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import confetti from "canvas-confetti";
import { Sparkles, Trophy } from "lucide-react";
import { topContributors } from "@/lib/mock-data";
import { EmojiRatingDisplay } from "./EmojiRating";

export function TopContributorsStrip({ celebrate = false }: { celebrate?: boolean }) {
  const { t } = useTranslation();
  const fired = useRef(false);
  useEffect(() => {
    if (!celebrate || fired.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    fired.current = true;
    const t1 = setTimeout(() => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 }, scalar: 0.8 });
    }, 400);
    return () => clearTimeout(t1);
  }, [celebrate]);

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-sunshine/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sunshine-foreground">
          <Sparkles className="h-3.5 w-3.5" /> {t("home.topContributors")}
        </div>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
          {t("home.topContributorsSub")}
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {topContributors.map((c, i) => (
          <div
            key={c.id}
            className="card-lift relative overflow-hidden rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
          >
            <div className="absolute -right-6 -top-6 grid h-20 w-20 rotate-12 place-items-center rounded-2xl bg-sunshine font-display text-xl font-bold text-sunshine-foreground shadow-playful">
              <Trophy className="h-7 w-7" />
            </div>
            <div className="aspect-[5/3] overflow-hidden rounded-2xl">
              <img src={c.highlightImg} alt={c.name} className="h-full w-full object-cover" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-display text-lg font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.school} · {c.ageGroup}</div>
              </div>
              <EmojiRatingDisplay rating={c.rating} />
            </div>
            <div className="mt-3 text-xs font-semibold text-primary">
              #{i + 1} of the month ✨
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

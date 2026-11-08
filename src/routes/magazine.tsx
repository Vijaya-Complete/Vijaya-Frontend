import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import cover from "@/assets/cover.jpeg";
import banner from "@/assets/banner.jpeg";

export const Route = createFileRoute("/magazine")({
  head: () => ({
    meta: [
      { title: "The Printed Magazine — Vijaya" },
      { name: "description", content: "Browse Vijaya past issues and pre-order the next printed magazine." },
      { property: "og:image", content: "/src/assets/cover.jpeg" },
    ],
  }),
  component: MagazinePage,
});

const PAST = [
  { name: "Issue 46", date: "April 2026", color: "from-sunshine to-blush" },
  { name: "Issue 45", date: "March 2026", color: "from-mint to-sky" },
  { name: "Issue 44", date: "February 2026", color: "from-cherry to-primary" },
  { name: "Issue 43", date: "January 2026", color: "from-sky to-blush" },
];

function MagazinePage() {
  const { t } = useTranslation();
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              {t("magazine.current")}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">{t("magazine.title")}</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">{t("magazine.subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full shadow-playful"><ShoppingCart className="mr-1 h-4 w-4" />{t("magazine.preorder")}</Button>
              <Button size="lg" variant="outline" className="rounded-full"><Download className="mr-1 h-4 w-4" />{t("magazine.download")}</Button>
            </div>
          </div>
          <div className="relative justify-self-center">
            <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2rem] bg-sunshine/40" />
            <img src={cover} alt="Issue 47 cover" className="w-72 rounded-[1.5rem] border-4 border-card object-cover shadow-playful md:w-80" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-8 font-display text-3xl font-bold">{t("magazine.past")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PAST.map((p) => (
            <div key={p.name} className="card-lift rounded-3xl border border-border/60 bg-card p-4">
              <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${p.color} p-5 text-primary-foreground shadow-playful`}>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Vijaya</div>
                <div className="mt-2 font-display text-3xl font-bold">{p.name}</div>
                <div className="mt-1 text-xs opacity-90">{p.date}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="font-display text-sm font-semibold">{p.name}</div>
                <Button size="sm" variant="ghost" className="rounded-full"><Download className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

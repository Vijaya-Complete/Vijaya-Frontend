import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Heart, Languages, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Vijaya" },
      { name: "description", content: "Vijaya is a children's magazine made for kids, by kids. Submit, get reviewed, get printed." },
    ],
  }),
  component: AboutPage,
});

const ICONS = [Heart, Languages, Sparkles];

function AboutPage() {
  const { t } = useTranslation();
  const values = t("about.values", { returnObjects: true }) as { t: string; b: string }[];
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-5xl font-bold md:text-6xl">{t("about.title")}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("about.lead")}</p>

      <div className="mt-12 rounded-3xl border border-border/60 bg-card p-8 shadow-playful">
        <h2 className="font-display text-2xl font-bold">{t("about.missionTitle")}</h2>
        <p className="mt-2 text-muted-foreground">{t("about.missionBody")}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {values.map((v, i) => {
          const Icon = ICONS[i] ?? Sparkles;
          return (
            <div key={i} className="card-lift rounded-3xl border border-border/60 bg-card p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-playful">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{v.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.b}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

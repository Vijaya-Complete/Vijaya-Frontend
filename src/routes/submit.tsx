import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Pencil, BookOpen } from "lucide-react";

export const Route = createFileRoute("/submit")({
  head: () => ({ meta: [{ title: "Submit — Vijaya" }, { name: "description", content: "Submit your drawing, story or poem to Vijaya." }] }),
  component: SubmitLayout,
});

function SubmitLayout() {
  const { t } = useTranslation();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const tabs = [
    { to: "/submit/drawing", label: t("submit.drawingTitle"), icon: Pencil },
    { to: "/submit/story", label: t("submit.storyTitle"), icon: BookOpen },
  ];
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-4xl font-bold md:text-5xl">Submit your work</h1>
      <p className="mt-2 text-muted-foreground">{t("submit.rules")}</p>
      <div className="mt-6 flex gap-2 rounded-full border border-border/60 bg-card p-1 w-fit">
        {tabs.map((t2) => {
          const active = path === t2.to;
          const Icon = t2.icon;
          return (
            <Link key={t2.to} to={t2.to} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              <Icon className="h-4 w-4" /> {t2.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-8"><Outlet /></div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen, Pencil, Sparkles, Stars, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownBanner } from "@/components/CountdownBanner";
import { TopContributorsStrip } from "@/components/TopContributorsStrip";
import { DrawingCard } from "@/components/DrawingCard";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { WavyDivider } from "@/components/WavyDivider";
import { activeIssue, drawings, stories } from "@/lib/mock-data";
import hero from "@/assets/hero-illustration.jpg";
import cover from "@/assets/cover.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vijaya — A magazine made by kids, for kids" },
      { name: "description", content: "Submit drawings, stories and poems. Get printed in Vijaya, the children's magazine." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const latestDrawings = drawings.slice(0, 6);
  const latestStories = stories.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sunshine/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sunshine-foreground">
              <Stars className="h-3.5 w-3.5" /> {t("tagline")}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {t("home.heroSubtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6 shadow-playful">
                <Link to="/drawings">
                  {t("nav.drawings")} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-2 px-6">
                <Link to="/stories">{t("nav.stories")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 hidden h-24 w-24 rotate-[-8deg] rounded-3xl bg-sunshine shadow-playful md:block" />
            <div className="absolute -bottom-8 -right-4 hidden h-28 w-28 rotate-[10deg] rounded-3xl bg-cherry/80 shadow-playful md:block" />
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-card bg-card shadow-playful">
              <img src={hero} alt="A child drawing with crayons" className="h-full w-full object-cover" width={1280} height={960} />
            </div>
            <div className="absolute -bottom-6 left-6 hidden rotate-[-4deg] overflow-hidden rounded-2xl border-4 border-card shadow-playful md:block">
              <img src={cover} alt="Vijaya magazine cover" className="h-32 w-24 object-cover" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-10">
          <CountdownBanner issueName={activeIssue.name} deadlineIso={activeIssue.deadline} />
        </div>
      </section>

      {/* CTA CARDS */}
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-4 md:grid-cols-2">
        <CtaCard
          tone="primary"
          icon={<Pencil className="h-7 w-7" />}
          title={t("home.ctaSubmitDrawing")}
          to="/drawings"
          badge="🎨"
        />
        <CtaCard
          tone="sunshine"
          icon={<BookOpen className="h-7 w-7" />}
          title={t("home.ctaSubmitStory")}
          to="/stories"
          badge="✍️"
        />
      </section>

      <TopContributorsStrip celebrate />

      <WavyDivider color="color-mix(in oklab, var(--sunshine) 35%, transparent)" />
      <section className="bg-[color-mix(in_oklab,var(--sunshine)_35%,transparent)] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            kicker={<Sparkles className="h-3.5 w-3.5" />}
            title={t("home.latestDrawings")}
            viewAllTo="/drawings"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestDrawings.map((d) => <DrawingCard key={d.id} d={d} />)}
          </div>
        </div>
      </section>
      <WavyDivider flip color="color-mix(in oklab, var(--sunshine) 35%, transparent)" />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader title={t("home.latestStories")} viewAllTo="/stories" />
        <div className="grid gap-5 md:grid-cols-2">
          {latestStories.map((s) => (
            <Link
              key={s.id}
              to="/stories"
              className="card-lift block rounded-3xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
                  {s.type}
                </span>
                <EmojiRatingDisplay rating={s.rating} count={s.reviewCount} />
              </div>
              <h3 className="mt-3 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.excerpt}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                by {s.author} · {s.issue}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-card/60 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader title={t("home.howItWorks")} />
          <div className="grid gap-6 md:grid-cols-3">
            <HowStep n={1} icon={<Pencil className="h-6 w-6" />} title={t("home.step1Title")} body={t("home.step1Body")} />
            <HowStep n={2} icon={<Sparkles className="h-6 w-6" />} title={t("home.step2Title")} body={t("home.step2Body")} />
            <HowStep n={3} icon={<Upload className="h-6 w-6" />} title={t("home.step3Title")} body={t("home.step3Body")} />
          </div>
        </div>
      </section>

      {/* RATE & REVIEW CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-cherry to-primary p-8 text-primary-foreground md:p-12">
          <div className="absolute -right-8 -top-8 h-44 w-44 rotate-12 rounded-3xl bg-sunshine/30" />
          <div className="absolute -bottom-10 -left-10 h-44 w-44 rotate-12 rounded-3xl bg-blush/30" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-3xl font-bold md:text-4xl">
                {t("home.rateCtaTitle")}
              </h3>
              <p className="mt-2 max-w-xl opacity-90">{t("home.rateCtaBody")}</p>
            </div>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-6 text-foreground">
              <Link to="/drawings">{t("home.viewAll")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ kicker, title, viewAllTo }: { kicker?: React.ReactNode; title: string; viewAllTo?: string }) {
  const { t } = useTranslation();
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {kicker && (
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-foreground/70">
            {kicker} Featured
          </div>
        )}
        <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{title}</h2>
      </div>
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
        >
          {t("home.viewAll")} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function CtaCard({
  icon, title, to, tone, badge,
}: {
  icon: React.ReactNode; title: string; to: string; tone: "primary" | "sunshine"; badge: string;
}) {
  const bg = tone === "primary"
    ? "bg-gradient-to-br from-primary to-cherry text-primary-foreground"
    : "bg-gradient-to-br from-sunshine to-blush text-sunshine-foreground";
  return (
    <Link
      to={to}
      className={`card-lift group relative flex items-center gap-5 overflow-hidden rounded-3xl p-6 shadow-playful ${bg}`}
    >
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/25 backdrop-blur">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-xl font-bold leading-tight md:text-2xl">{title}</div>
        <div className="mt-1 text-sm opacity-90">Tap to start →</div>
      </div>
      <div className="absolute -right-2 -top-2 text-5xl opacity-30 transition group-hover:rotate-12">
        {badge}
      </div>
    </Link>
  );
}

function HowStep({ n, icon, title, body }: { n: number; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card-lift rounded-3xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-playful">
          {icon}
        </div>
        <div className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Step 0{n}
        </div>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

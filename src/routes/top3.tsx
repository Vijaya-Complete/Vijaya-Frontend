import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { topContributors } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/top3")({
  head: () => ({ meta: [{ title: "Top 3 Contributors — Vijaya" }] }),
  component: Top3Page,
});

const rankColors = ["from-sunshine to-primary", "from-sky to-mint", "from-blush to-cherry"];
const rankLabels = ["rank1","rank2","rank3"];
const trophyColors = ["text-yellow-500","text-slate-400","text-amber-600"];

function Top3Page() {
  const { t } = useTranslation();
  const [congrats, setCongrats] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, {name:string;text:string}[]>>({});
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("vijaya_token");

  const sendCongrats = (id: string) => {
    const text = congrats[id]?.trim(); if (!text) return;
    setMessages(m => ({ ...m, [id]: [...(m[id] ?? []), { name: "You", text }] }));
    setCongrats(c => ({ ...c, [id]: "" }));
    setSent(s => ({ ...s, [id]: true }));
    toast.success("Congratulations sent! 🎉");
    setTimeout(() => setSent(s => ({ ...s, [id]: false })), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-sunshine/60 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-sunshine-foreground mb-4">
          <Trophy className="h-4 w-4" /> {t("top3.title")}
        </div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t("top3.subtitle")}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {topContributors.map((c, i) => (
          <div key={c.id} className="card-lift rounded-3xl border border-border/60 bg-card overflow-hidden shadow-playful">
            <div className={`relative h-40 bg-gradient-to-br ${rankColors[i]}`}>
              <img src={c.highlightImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-multiply" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Trophy className={`h-10 w-10 ${trophyColors[i]} drop-shadow-lg`} />
                <div className="mt-1 font-display text-lg font-bold text-white drop-shadow">{t(`top3.${rankLabels[i]}`)}</div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-xl font-bold">{c.name}</div>
                  <div className="text-sm text-muted-foreground">{c.school}</div>
                  <div className="mt-1 inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">Ages {c.ageGroup}</div>
                </div>
                <EmojiRatingDisplay rating={c.rating} count={0} />
              </div>

              <div className="mt-4 space-y-2">
                {(messages[c.id] ?? []).map((m, mi) => (
                  <div key={mi} className="rounded-2xl bg-secondary/60 p-3 text-sm">
                    <span className="font-semibold">{m.name}:</span> {m.text}
                  </div>
                ))}
              </div>

              {isLoggedIn ? (
                <div className="mt-4 space-y-2">
                  <Textarea
                    placeholder={t("top3.congratulatePlaceholder")}
                    value={congrats[c.id] ?? ""}
                    onChange={e => setCongrats(prev => ({ ...prev, [c.id]: e.target.value }))}
                    className="rounded-2xl text-sm resize-none"
                    rows={2}
                    maxLength={280}
                  />
                  <Button size="sm" className="w-full rounded-full" onClick={() => sendCongrats(c.id)} disabled={sent[c.id]}>
                    <Send className="mr-2 h-3.5 w-3.5" /> {sent[c.id] ? "Sent! 🎉" : t("top3.congratulate")}
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-center text-xs text-muted-foreground">Log in to send congratulations</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

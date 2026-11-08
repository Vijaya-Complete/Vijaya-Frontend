import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CornerDownRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmojiRatingDisplay, EmojiRatingInput } from "@/components/EmojiRating";
import { drawings } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/drawings/$id")({
  loader: ({ params }) => {
    const d = drawings.find((x) => x.id === params.id);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Vijaya` },
          { name: "description", content: `Drawing by ${loaderData.firstName} from ${loaderData.school}.` },
          { property: "og:image", content: loaderData.imageUrl },
        ]
      : [{ title: "Drawing — Vijaya" }],
  }),
  component: DrawingDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Drawing not found</h1>
      <Link to="/drawings" className="mt-4 inline-block text-primary underline">Back to gallery</Link>
    </div>
  ),
});

interface Review { id: string; name: string; text: string; replies: { id: string; name: string; text: string }[]; }

function DrawingDetail() {
  const { t } = useTranslation();
  const d = Route.useLoaderData();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const submitReview = () => {
    if (!name.trim() || !text.trim()) return toast.error("Add a name and a kind review");
    setReviews((r) => [
      { id: crypto.randomUUID(), name: name.trim(), text: text.trim(), replies: [] },
      ...r,
    ]);
    setName(""); setText("");
    toast.success("Thanks for the kind review! 🌟");
  };

  const submitReply = (id: string) => {
    if (!replyText.trim()) return;
    setReviews((rs) => rs.map((r) =>
      r.id === id
        ? { ...r, replies: [...r.replies, { id: crypto.randomUUID(), name: d.firstName, text: replyText.trim() }] }
        : r
    ));
    setReplyText(""); setReplyOpen(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
      <Link to="/drawings" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> {t("nav.drawings")}
      </Link>

      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] border-4 border-card bg-card shadow-playful">
          {d.top30 && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-sunshine px-3 py-1 text-xs font-bold text-sunshine-foreground shadow-playful">
              {t("gallery.top30")}
            </span>
          )}
          <img src={d.imageUrl} alt={d.title} className="h-full w-full object-cover" />
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-primary">{d.issue}</div>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{d.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {t("detail.by")} <span className="font-semibold text-foreground">{d.firstName}</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Info label={t("detail.school")} value={d.school} />
            <Info label={t("detail.age")} value={String(d.age)} />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-foreground/80">{d.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <EmojiRatingDisplay rating={d.rating} count={d.reviewCount} />
          </div>

          <div className="mt-7 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="text-sm font-semibold">{t("detail.rateThis")}</div>
            <div className="mt-3">
              <EmojiRatingInput value={rating} onChange={(n) => { setRating(n); toast.success("Rating sent! 🎉"); }} />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">{t("detail.reviews")}</h2>

        <div className="mt-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
            <Input placeholder={t("detail.yourName")} value={name} onChange={(e) => setName(e.target.value)} className="rounded-full" />
            <Textarea placeholder={t("detail.writeReview")} value={text} onChange={(e) => setText(e.target.value)} className="rounded-2xl" />
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={submitReview} className="rounded-full">
              <Send className="mr-1 h-4 w-4" /> {t("detail.post")}
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {reviews.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
              {t("detail.noReviews")}
            </p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.name}</div>
                <button
                  className="text-xs font-semibold text-primary hover:underline"
                  onClick={() => setReplyOpen((id) => (id === r.id ? null : r.id))}
                >
                  {t("detail.reply")}
                </button>
              </div>
              <p className="mt-1 text-sm text-foreground/80">{r.text}</p>

              {r.replies.map((rep) => (
                <div key={rep.id} className="mt-3 ml-6 flex gap-2 rounded-xl bg-secondary p-3 text-sm">
                  <CornerDownRight className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{rep.name} <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Artist</span></div>
                    <div>{rep.text}</div>
                  </div>
                </div>
              ))}

              {replyOpen === r.id && (
                <div className="mt-3 ml-6 flex gap-2">
                  <Input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Say thanks…" className="rounded-full" />
                  <Button onClick={() => submitReply(r.id)} className="rounded-full">Send</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

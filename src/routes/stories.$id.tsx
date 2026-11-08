import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EmojiRatingDisplay, EmojiRatingInput } from "@/components/EmojiRating";
import { stories } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/stories/$id")({
  loader: ({ params }) => {
    const story = stories.find((s) => s.id === params.id);
    if (!story) throw notFound();
    return story;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Story"} — Vijaya` },
      { name: "description", content: loaderData?.excerpt ?? "" },
    ],
  }),
  component: StoryDetail,
  errorComponent: () => <ErrorState />,
  notFoundComponent: () => <ErrorState />,
});

function ErrorState() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Story not found</h1>
      <p className="mt-2 text-muted-foreground">It may have been moved.</p>
      <Button asChild className="mt-6 rounded-full"><Link to="/stories">Back to stories</Link></Button>
    </div>
  );
}

function StoryDetail() {
  const story = Route.useLoaderData();
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [reviews, setReviews] = useState<{ name: string; text: string; rating: number }[]>([]);

  const submit = () => {
    if (!name.trim() || !review.trim() || !rating) {
      toast.error("Add your name, a kind review, and a rating.");
      return;
    }
    setReviews((r) => [{ name, text: review, rating }, ...r]);
    setName(""); setReview(""); setRating(0);
    toast.success("Thanks for your review! 🌟");
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <Link to="/stories" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All stories
      </Link>

      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-playful">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sunshine/60 px-3 py-1 text-xs font-bold text-sunshine-foreground">{story.type}</span>
          {story.top30 && <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">⭐ Top 30</span>}
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">{story.title}</h1>
        <div className="mt-2 text-sm text-muted-foreground">
          {t("detail.by")} <span className="font-semibold text-foreground">{story.author}</span> · {story.issue}
        </div>
        <div className="mt-4"><EmojiRatingDisplay rating={story.rating} count={story.reviewCount} /></div>

        <div className="prose prose-stone mt-8 max-w-none font-body text-base leading-relaxed text-foreground">
          <p>{story.excerpt}</p>
          <p>
            The wind whispered secrets to the leaves and the leaves whispered back — about a small adventurer
            with crayon-stained fingers and an enormous imagination. {story.author} took those whispers, wove them
            into words, and hid a tiny smile inside every sentence. Read it slowly. The story rewards quiet readers.
          </p>
          <p>This is a placeholder body until the Go API serves the full text or PDF.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="rounded-full"><Share2 className="mr-1 h-4 w-4" /> Share</Button>
        </div>
      </div>

      {/* Rate & review */}
      <section className="mt-10 rounded-3xl border border-border/60 bg-card p-6">
        <h2 className="font-display text-2xl font-bold">{t("detail.rateThis")}</h2>
        <div className="mt-3"><EmojiRatingInput value={rating} onChange={setRating} /></div>

        <div className="mt-6 grid gap-3">
          <Input placeholder={t("detail.yourName")} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="rounded-xl" />
          <Textarea placeholder={t("detail.writeReview")} value={review} onChange={(e) => setReview(e.target.value)} maxLength={500} rows={3} className="rounded-xl" />
          <div className="flex justify-end">
            <Button onClick={submit} className="rounded-full px-5">{t("detail.post")}</Button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="font-display text-lg font-semibold">{t("detail.reviews")}</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("detail.noReviews")}</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="rounded-2xl bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.name}</div>
                  <EmojiRatingDisplay rating={r.rating} count={1} />
                </div>
                <p className="mt-1 text-sm text-foreground/80">{r.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}

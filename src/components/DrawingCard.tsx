import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { EmojiRatingDisplay } from "./EmojiRating";
import type { Drawing } from "@/lib/mock-data";

export function DrawingCard({ d }: { d: Drawing }) {
  const { t } = useTranslation();
  return (
    <Link
      to="/drawings/$id"
      params={{ id: d.id }}
      className="card-lift group block overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={d.imageUrl}
          alt={d.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {d.top30 && (
          <span className="absolute left-3 top-3 rounded-full bg-sunshine px-2.5 py-1 text-xs font-bold text-sunshine-foreground shadow-playful">
            {t("gallery.top30")}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground/80 backdrop-blur">
          {d.issue}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="truncate font-display text-base font-semibold">{d.title}</div>
          <div className="truncate text-xs text-muted-foreground">
            {d.firstName} · {d.ageGroup}
          </div>
        </div>
        <EmojiRatingDisplay rating={d.rating} count={d.reviewCount} />
      </div>
    </Link>
  );
}

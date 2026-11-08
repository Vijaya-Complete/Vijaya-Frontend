import { useState } from "react";

const EMOJIS = ["😐", "🙂", "😊", "😄", "🤩"];

export function EmojiRatingDisplay({ rating, count }: { rating: number; count?: number }) {
  const rounded = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-1 text-sm">
      <span className="text-lg leading-none">{EMOJIS[rounded - 1]}</span>
      <span className="font-semibold text-foreground/80">{rating.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">· {count}</span>
      )}
    </div>
  );
}

export function EmojiRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="inline-flex gap-2">
      {EMOJIS.map((e, i) => {
        const n = i + 1;
        const active = (hover ?? value) >= n;
        return (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(n)}
            className={`grid h-12 w-12 place-items-center rounded-2xl border transition ${
              active
                ? "scale-110 border-primary bg-sunshine shadow-playful"
                : "border-border bg-card hover:bg-secondary"
            }`}
            aria-label={`Rate ${n}`}
          >
            <span className="text-2xl leading-none">{e}</span>
          </button>
        );
      })}
    </div>
  );
}

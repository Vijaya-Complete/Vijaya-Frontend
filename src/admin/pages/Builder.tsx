import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save, Download, Eye, EyeOff, GripVertical, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { drawings, stories, topContributors } from "@/lib/mock-data";
import { toast } from "sonner";
import coverImg from "@/assets/cover.jpeg";

// ── Types ──────────────────────────────────────────────────────
type SlotKind = "story-featured" | "story-regular" | "drawing-top1" | "drawing-top2" | "drawing-top3" | "drawing-regular" | "empty";

interface Slot {
  id: string;
  kind: SlotKind;
  itemId?: string;
  rank?: 1 | 2 | 3;
}

interface Spread {
  id: string;
  label: string;
  leftSlots: Slot[];   // Essays & Poems side
  rightSlots: Slot[];  // Drawings side
}

// ── Helpers ────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);

const MEDAL: Record<number, { emoji: string; color: string; label: string }> = {
  1: { emoji: "🥇", color: "text-yellow-500", label: "1st" },
  2: { emoji: "🥈", color: "text-slate-400",  label: "2nd" },
  3: { emoji: "🥉", color: "text-amber-600",  label: "3rd" },
};

const top30S = stories.filter(s => s.top30);
const top30D = drawings.filter(d => d.top30);

function makeSpread(label: string): Spread {
  return {
    id: uid(),
    label,
    // Left: 1 featured (rank 1) + 1 rank2 + 1 rank3 + 5 regular
    leftSlots: [
      { id: uid(), kind: "story-featured", rank: 1 },
      { id: uid(), kind: "story-regular" },
      { id: uid(), kind: "story-featured", rank: 2 },
      { id: uid(), kind: "story-featured", rank: 3 },
      { id: uid(), kind: "story-regular" },
      { id: uid(), kind: "story-regular" },
      { id: uid(), kind: "story-regular" },
      { id: uid(), kind: "story-regular" },
    ],
    // Right: top3 row + 8 regular
    rightSlots: [
      { id: uid(), kind: "drawing-top1", rank: 1 },
      { id: uid(), kind: "drawing-top2", rank: 2 },
      { id: uid(), kind: "drawing-top3", rank: 3 },
      { id: uid(), kind: "drawing-regular" },
      { id: uid(), kind: "drawing-regular" },
      { id: uid(), kind: "drawing-regular" },
      { id: uid(), kind: "drawing-regular" },
      { id: uid(), kind: "drawing-regular" },
      { id: uid(), kind: "drawing-regular" },
      { id: uid(), kind: "drawing-regular" },
      { id: uid(), kind: "drawing-regular" },
    ],
  };
}

const INITIAL: Spread[] = [
  makeSpread("Section 1"),
  makeSpread("Section 2"),
];

// Pre-populate with mock data
INITIAL[0].leftSlots[0].itemId  = top30S[0]?.id;
INITIAL[0].leftSlots[1].itemId  = top30S[1]?.id;
INITIAL[0].leftSlots[2].itemId  = top30S[2]?.id;
INITIAL[0].leftSlots[3].itemId  = top30S[3]?.id;
INITIAL[0].leftSlots[4].itemId  = top30S[4]?.id;
INITIAL[0].leftSlots[5].itemId  = top30S[5]?.id;
INITIAL[0].rightSlots[0].itemId = top30D[0]?.id;
INITIAL[0].rightSlots[1].itemId = top30D[1]?.id;
INITIAL[0].rightSlots[2].itemId = top30D[2]?.id;
INITIAL[0].rightSlots[3].itemId = top30D[3]?.id;
INITIAL[0].rightSlots[4].itemId = top30D[4]?.id;
INITIAL[0].rightSlots[5].itemId = top30D[5]?.id;
INITIAL[0].rightSlots[6].itemId = top30D[6]?.id;
INITIAL[0].rightSlots[7].itemId = top30D[7]?.id;

// ── Sub-components ─────────────────────────────────────────────

function StorySlot({ slot, onDrop, onClear, preview }: {
  slot: Slot; onDrop: (slotId: string, itemId: string) => void;
  onClear: (slotId: string) => void; preview: boolean;
}) {
  const story = stories.find(s => s.id === slot.itemId);
  const isFeatured = slot.kind === "story-featured";
  const rank = slot.rank;
  const medal = rank ? MEDAL[rank] : null;

  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData("itemId"); if (id) onDrop(slot.id, id); }}
      className={`relative rounded-xl border-2 border-dashed flex flex-col justify-between transition-all overflow-hidden
        ${isFeatured ? "border-primary/40 bg-primary/5" : "border-border/40 bg-secondary/20"}
        ${story ? "border-primary/30" : ""}
        ${isFeatured ? "min-h-[90px]" : "min-h-[70px]"}`}
    >
      {/* Medal badge */}
      {medal && (
        <div className="absolute top-1 right-1 z-10">
          <span className="text-lg drop-shadow">{medal.emoji}</span>
        </div>
      )}

      {story ? (
        <div className="p-2 flex-1">
          <div className={`font-display font-bold leading-tight line-clamp-2 ${isFeatured ? "text-[11px]" : "text-[10px]"}`}>
            {story.title}
          </div>
          <div className="text-[9px] text-muted-foreground mt-0.5 italic">by {story.author}</div>
          <div className="text-[9px] text-muted-foreground">age {stories.find(s=>s.id===slot.itemId) ? "—" : ""}</div>
          {!preview && (
            <button onClick={() => onClear(slot.id)} className="absolute bottom-1 right-1 rounded-lg bg-white/80 p-0.5 hover:bg-destructive/10">
              <X className="h-2.5 w-2.5 text-destructive" />
            </button>
          )}
        </div>
      ) : (
        !preview && (
          <div className="flex flex-col items-center justify-center h-full p-2 opacity-30 text-center">
            <div className="text-lg">✍️</div>
            <div className="text-[9px] text-muted-foreground">
              {isFeatured ? `${rank && MEDAL[rank]?.label} place` : "drop story"}
            </div>
          </div>
        )
      )}
    </div>
  );
}

function DrawingSlot({ slot, onDrop, onClear, preview }: {
  slot: Slot; onDrop: (slotId: string, itemId: string) => void;
  onClear: (slotId: string) => void; preview: boolean;
}) {
  const drawing = drawings.find(d => d.id === slot.itemId);
  const rank = slot.rank;
  const medal = rank ? MEDAL[rank] : null;
  const isTopSlot = slot.kind === "drawing-top1" || slot.kind === "drawing-top2" || slot.kind === "drawing-top3";

  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData("itemId"); if (id) onDrop(slot.id, id); }}
      className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-all
        ${isTopSlot ? "aspect-[1/1.1]" : "aspect-square"}
        ${drawing ? "border-primary/30" : "border-border/40 bg-secondary/20"}`}
    >
      {drawing ? (
        <>
          <img src={drawing.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-1 left-1 right-1">
            <div className="text-white text-[9px] font-bold drop-shadow line-clamp-1">{drawing.firstName}</div>
            <div className="text-white/70 text-[8px]">age {drawing.age}</div>
          </div>
          {medal && (
            <div className="absolute top-1 right-1">
              <span className="text-base drop-shadow-lg">{medal.emoji}</span>
            </div>
          )}
          {!preview && (
            <button onClick={() => onClear(slot.id)} className="absolute top-1 left-1 rounded-lg bg-black/50 p-0.5">
              <X className="h-2.5 w-2.5 text-white" />
            </button>
          )}
        </>
      ) : (
        !preview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
            {medal
              ? <span className="text-xl">{medal.emoji}</span>
              : <span className="text-sm">🖼️</span>}
            <div className="text-[9px] text-muted-foreground mt-0.5">
              {medal ? `${medal.label} place` : "drop drawing"}
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ── Main Builder ───────────────────────────────────────────────
export function Builder() {
  const { t } = useTranslation();
  const [spreads, setSpreads]   = useState<Spread[]>(INITIAL);
  const [preview, setPreview]   = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [panel, setPanel]       = useState<"stories"|"drawings">("stories");
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const updateSlots = (
    spreadId: string,
    side: "leftSlots" | "rightSlots",
    slotId: string,
    itemId: string | undefined
  ) => {
    setSpreads(prev => prev.map(sp =>
      sp.id !== spreadId ? sp : {
        ...sp,
        [side]: sp[side].map((sl: Slot) =>
          sl.id === slotId ? { ...sl, itemId } : sl
        ),
      }
    ));
  };

  const handleDrop = (spreadId: string, side: "leftSlots"|"rightSlots") =>
    (slotId: string, itemId: string) => updateSlots(spreadId, side, slotId, itemId);

  const handleClear = (spreadId: string, side: "leftSlots"|"rightSlots") =>
    (slotId: string) => updateSlots(spreadId, side, slotId, undefined);

  const spread = spreads[activePage];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.builder.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Arrange top 30 submissions into the magazine spread, then export to PDF
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => setPreview(v => !v)}>
            {preview
              ? <><EyeOff className="mr-2 h-4 w-4" /> Edit</>
              : <><Eye className="mr-2 h-4 w-4" /> Preview</>}
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => toast.success("Layout saved!")}>
            <Save className="mr-2 h-4 w-4" /> {t("admin.builder.saveLayout")}
          </Button>
          <Button className="rounded-full shadow-playful"
            onClick={() => toast.success("PDF export started — print-ready file generated!")}>
            <Download className="mr-2 h-4 w-4" /> {t("admin.builder.exportPdf")}
          </Button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* ── Left panel: submission lists ──────────────────── */}
        {!preview && (
          <div className="w-52 flex-shrink-0">
            <div className="sticky top-6 rounded-3xl border border-border/60 bg-card p-3 shadow-playful">
              <div className="font-display font-bold text-sm mb-3 px-1">Top 30 Submissions</div>

              {/* Tab toggle */}
              <div className="flex rounded-full border border-border overflow-hidden mb-3">
                {(["stories", "drawings"] as const).map(p => (
                  <button key={p} onClick={() => setPanel(p)}
                    className={`flex-1 py-1.5 text-xs font-bold transition ${panel===p ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                    {p === "stories" ? "✍️ Stories" : "🎨 Art"}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                {(panel === "stories" ? top30S : top30D).map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData("itemId", item.id);
                      setDraggingId(item.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className={`flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/40 p-2
                      cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors
                      ${draggingId === item.id ? "opacity-50 scale-95" : ""}`}
                  >
                    <GripVertical className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    {"imageUrl" in item
                      ? <img src={(item as any).imageUrl} alt="" className="h-7 w-7 rounded-lg object-cover flex-shrink-0" />
                      : <div className="h-7 w-7 rounded-lg bg-primary/10 grid place-items-center text-xs flex-shrink-0">✍️</div>}
                    <div className="min-w-0">
                      <div className="text-xs font-bold line-clamp-1">{item.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {"firstName" in item ? (item as any).firstName : (item as any).author}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Magazine spread canvas ─────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Section tabs */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
              {spreads.map((sp, i) => (
                <button key={sp.id} onClick={() => setActivePage(i)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${activePage===i ? "bg-primary text-primary-foreground shadow-playful" : "bg-secondary hover:bg-secondary/80 text-foreground/70"}`}>
                  {sp.label}
                </button>
              ))}
            </div>
            {!preview && (
              <button
                onClick={() => setSpreads(p => [...p, makeSpread(`Section ${p.length + 1}`)])}
                className="rounded-full border border-dashed border-border px-4 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition"
              >
                + Add section
              </button>
            )}
            {/* Page arrows */}
            <div className="ml-auto flex gap-1">
              <button onClick={() => setActivePage(p => Math.max(0, p-1))} disabled={activePage===0}
                className="rounded-xl p-1.5 hover:bg-secondary disabled:opacity-30 transition">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setActivePage(p => Math.min(spreads.length-1, p+1))} disabled={activePage===spreads.length-1}
                className="rounded-xl p-1.5 hover:bg-secondary disabled:opacity-30 transition">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Two-page spread — matches Image 3 layout */}
          <div className="rounded-3xl border-2 border-border/60 bg-white shadow-playful overflow-hidden">
            {/* Section label */}
            <div className="flex items-center justify-between bg-cherry/10 border-b border-border/40 px-5 py-2">
              <span className="rounded-full bg-cherry/80 text-white px-3 py-0.5 text-xs font-bold shadow-sm">
                {spread.label}
              </span>
              <span className="text-xs text-muted-foreground">Two-page spread</span>
            </div>

            <div className="grid grid-cols-2 divide-x divide-border/40" style={{ minHeight: 600 }}>

              {/* ── LEFT PAGE: Essays & Poems ──────────────────── */}
              <div className="p-5 bg-blush/20">
                {/* Page header */}
                <div className="flex items-center gap-2 mb-4">
                  <img src={coverImg} alt="" className="h-12 w-12 rounded-xl object-cover border-2 border-primary/20 shadow-sm flex-shrink-0" />
                  <div className="font-display text-sm font-bold text-primary leading-tight">
                    essays &amp; poems
                  </div>
                </div>

                {/* Slots grid — mirrors Image 3 layout */}
                {/* Row 1: rank1 big + rank2 big */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <StorySlot slot={spread.leftSlots[0]} onDrop={handleDrop(spread.id,"leftSlots")} onClear={handleClear(spread.id,"leftSlots")} preview={preview} />
                  <StorySlot slot={spread.leftSlots[1]} onDrop={handleDrop(spread.id,"leftSlots")} onClear={handleClear(spread.id,"leftSlots")} preview={preview} />
                </div>
                {/* Row 2: rank3 + two regular */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <StorySlot slot={spread.leftSlots[2]} onDrop={handleDrop(spread.id,"leftSlots")} onClear={handleClear(spread.id,"leftSlots")} preview={preview} />
                  <StorySlot slot={spread.leftSlots[3]} onDrop={handleDrop(spread.id,"leftSlots")} onClear={handleClear(spread.id,"leftSlots")} preview={preview} />
                  <StorySlot slot={spread.leftSlots[4]} onDrop={handleDrop(spread.id,"leftSlots")} onClear={handleClear(spread.id,"leftSlots")} preview={preview} />
                </div>
                {/* Row 3: three regular */}
                <div className="grid grid-cols-3 gap-2">
                  <StorySlot slot={spread.leftSlots[5]} onDrop={handleDrop(spread.id,"leftSlots")} onClear={handleClear(spread.id,"leftSlots")} preview={preview} />
                  <StorySlot slot={spread.leftSlots[6]} onDrop={handleDrop(spread.id,"leftSlots")} onClear={handleClear(spread.id,"leftSlots")} preview={preview} />
                  <StorySlot slot={spread.leftSlots[7]} onDrop={handleDrop(spread.id,"leftSlots")} onClear={handleClear(spread.id,"leftSlots")} preview={preview} />
                </div>
              </div>

              {/* ── RIGHT PAGE: Drawings ───────────────────────── */}
              <div className="p-5 bg-blush/10">
                {/* Page header */}
                <div className="flex items-center gap-2 mb-4">
                  <img src={coverImg} alt="" className="h-12 w-12 rounded-xl object-cover border-2 border-primary/20 shadow-sm flex-shrink-0" />
                  <div className="font-display text-sm font-bold text-primary leading-tight">
                    Drawings
                  </div>
                </div>

                {/* Top 3 row — gold/silver/bronze slots */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <DrawingSlot slot={spread.rightSlots[0]} onDrop={handleDrop(spread.id,"rightSlots")} onClear={handleClear(spread.id,"rightSlots")} preview={preview} />
                  <DrawingSlot slot={spread.rightSlots[1]} onDrop={handleDrop(spread.id,"rightSlots")} onClear={handleClear(spread.id,"rightSlots")} preview={preview} />
                  <DrawingSlot slot={spread.rightSlots[2]} onDrop={handleDrop(spread.id,"rightSlots")} onClear={handleClear(spread.id,"rightSlots")} preview={preview} />
                </div>

                {/* Regular 4×2 grid */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {spread.rightSlots.slice(3, 7).map(slot => (
                    <DrawingSlot key={slot.id} slot={slot} onDrop={handleDrop(spread.id,"rightSlots")} onClear={handleClear(spread.id,"rightSlots")} preview={preview} />
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {spread.rightSlots.slice(7, 11).map(slot => (
                    <DrawingSlot key={slot.id} slot={slot} onDrop={handleDrop(spread.id,"rightSlots")} onClear={handleClear(spread.id,"rightSlots")} preview={preview} />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Legend */}
          {!preview && (
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">🥇 Gold — 1st place</span>
              <span className="flex items-center gap-1">🥈 Silver — 2nd place</span>
              <span className="flex items-center gap-1">🥉 Bronze — 3rd place</span>
              <span className="flex items-center gap-1 ml-auto">Drag submissions from the left panel into slots</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

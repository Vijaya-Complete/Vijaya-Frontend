import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Download, Save, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { drawings, stories, topContributors } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/builder")({
  head: () => ({ meta: [{ title: "Magazine Builder — Admin" }] }),
  component: AdminBuilder,
});

type SlotType = "drawing" | "story" | "top3" | "empty";
type Slot = { id: string; type: SlotType; itemId?: string };
type Page = { id: string; label: string; slots: Slot[] };

const mkSlots = (n = 4): Slot[] =>
  Array.from({ length: n }, () => ({ id: crypto.randomUUID(), type: "empty" as SlotType }));

const INITIAL: Page[] = [
  { id:"p1", label:"Drawings — Page 1", slots: [
    { id:"s1", type:"drawing", itemId: drawings[0]?.id },
    { id:"s2", type:"drawing", itemId: drawings[1]?.id },
    { id:"s3", type:"drawing", itemId: drawings[2]?.id },
    { id:"s4", type:"empty" },
  ]},
  { id:"p2", label:"Drawings — Page 2", slots: [
    { id:"s5", type:"drawing", itemId: drawings[3]?.id },
    ...mkSlots(3),
  ]},
  { id:"p3", label:"Stories — Page 1", slots: [
    { id:"s9",  type:"story", itemId: stories[0]?.id },
    { id:"s10", type:"story", itemId: stories[1]?.id },
    ...mkSlots(2),
  ]},
  { id:"p4", label:"Top 3 Contributors", slots: [
    { id:"s13", type:"top3" },
    { id:"s14", type:"top3" },
    { id:"s15", type:"top3" },
    { id:"s16", type:"empty" },
  ]},
];

function AdminBuilder() {
  const { t } = useTranslation();
  const [pages, setPages] = useState(INITIAL);
  const [dragging, setDragging] = useState<{ id: string; isDrawing: boolean } | null>(null);
  const [preview, setPreview] = useState(false);
  const [panel, setPanel] = useState<"drawings" | "stories">("drawings");

  const top30D = drawings.filter(d => d.top30);
  const top30S = stories.filter(s => s.top30);

  const getD = (id?: string) => drawings.find(d => d.id === id);
  const getS = (id?: string) => stories.find(s => s.id === id);

  const drop = (pageId: string, slotId: string) => {
    if (!dragging) return;
    setPages(p => p.map(pg => pg.id !== pageId ? pg : {
      ...pg,
      slots: pg.slots.map(sl => sl.id !== slotId ? sl : {
        ...sl, type: dragging.isDrawing ? "drawing" : "story", itemId: dragging.id,
      }),
    }));
    setDragging(null);
  };

  const clearSlot = (pageId: string, slotId: string) =>
    setPages(p => p.map(pg => pg.id !== pageId ? pg : {
      ...pg, slots: pg.slots.map(sl => sl.id !== slotId ? sl : { ...sl, type:"empty", itemId:undefined }),
    }));

  const addPage = () =>
    setPages(p => [...p, { id: crypto.randomUUID(), label: `Page ${p.length + 1}`, slots: mkSlots(4) }]);

  const removePage = (id: string) => {
    if (pages.length <= 1) return;
    setPages(p => p.filter(pg => pg.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.builder.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Drag submissions onto page slots, then export to PDF</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => setPreview(v => !v)}>
            {preview ? <><EyeOff className="mr-2 h-4 w-4" /> Edit</> : <><Eye className="mr-2 h-4 w-4" /> Preview</>}
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => toast.success("Layout saved!")}>
            <Save className="mr-2 h-4 w-4" /> {t("admin.builder.saveLayout")}
          </Button>
          <Button className="rounded-full shadow-playful" onClick={() => toast.success("PDF export started — print-ready file generated!")}>
            <Download className="mr-2 h-4 w-4" /> {t("admin.builder.exportPdf")}
          </Button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Left panel: top 30 submissions */}
        {!preview && (
          <div className="w-56 flex-shrink-0">
            <div className="sticky top-24 rounded-3xl border border-border/60 bg-card p-3 shadow-playful">
              <div className="font-display font-bold text-sm mb-3 px-1">Top 30 Submissions</div>
              <div className="flex rounded-full border border-border overflow-hidden mb-3">
                {(["drawings","stories"] as const).map(s => (
                  <button key={s} onClick={() => setPanel(s)}
                    className={`flex-1 py-1.5 text-xs font-bold transition ${panel === s ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                    {s === "drawings" ? "🎨" : "📝"}
                  </button>
                ))}
              </div>
              <div className="space-y-2 max-h-[65vh] overflow-y-auto">
                {(panel === "drawings" ? top30D : top30S).map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDragging({ id: item.id, isDrawing: panel === "drawings" })}
                    className="flex items-center gap-2 rounded-2xl border border-border/60 bg-secondary/40 p-2 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors"
                  >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    {"imageUrl" in item
                      ? <img src={(item as any).imageUrl} alt="" className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
                      : <div className="h-8 w-8 rounded-lg bg-sunshine/40 grid place-items-center text-sm flex-shrink-0">📝</div>
                    }
                    <div className="min-w-0">
                      <div className="text-xs font-bold line-clamp-1">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{"firstName" in item ? (item as any).firstName : (item as any).author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pages canvas */}
        <div className="flex-1 space-y-5">
          {pages.map((pg, pi) => (
            <div key={pg.id} className="rounded-3xl border-2 border-border/60 bg-card overflow-hidden shadow-playful">
              <div className="flex items-center justify-between border-b border-border/40 bg-secondary/30 px-5 py-2.5">
                <span className="font-display font-bold text-sm">{pg.label || `Page ${pi + 1}`}</span>
                {!preview && (
                  <button onClick={() => removePage(pg.id)} className="rounded-xl p-1.5 hover:bg-destructive/10 transition">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                )}
              </div>
              {/* A4-proportioned page */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white border border-border/30 p-4" style={{ aspectRatio:"1/1.414", maxHeight:480 }}>
                  {pg.slots.map(slot => {
                    const d = slot.type === "drawing" ? getD(slot.itemId) : null;
                    const s = slot.type === "story" ? getS(slot.itemId) : null;
                    const isTop3 = slot.type === "top3";
                    return (
                      <div
                        key={slot.id}
                        className={`relative rounded-xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all
                          ${slot.type === "empty" ? "border-border/30 bg-secondary/10" : "border-primary/20 bg-primary/3"}`}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); drop(pg.id, slot.id); }}
                      >
                        {d && (
                          <>
                            <img src={d.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-1.5 left-2 text-white text-xs font-bold drop-shadow line-clamp-1">{d.title}</div>
                            {!preview && (
                              <button onClick={() => clearSlot(pg.id, slot.id)} className="absolute top-1 right-1 rounded-lg bg-black/50 p-1">
                                <Trash2 className="h-3 w-3 text-white" />
                              </button>
                            )}
                          </>
                        )}
                        {s && (
                          <div className="p-2 w-full h-full flex flex-col">
                            <span className="rounded-full bg-sunshine/70 px-1.5 py-0.5 text-[10px] font-bold self-start mb-1">{s.type}</span>
                            <div className="font-bold text-[11px] line-clamp-2 leading-tight">{s.title}</div>
                            <div className="text-[10px] text-muted-foreground">{s.author}</div>
                            {!preview && (
                              <button onClick={() => clearSlot(pg.id, slot.id)} className="mt-auto self-end rounded-lg hover:bg-destructive/10 p-1">
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </button>
                            )}
                          </div>
                        )}
                        {isTop3 && (
                          <div className="text-center p-2">
                            <div className="text-2xl">🏆</div>
                            <div className="text-xs font-bold mt-1 text-muted-foreground">Top 3</div>
                          </div>
                        )}
                        {slot.type === "empty" && !preview && (
                          <div className="text-center opacity-40">
                            <div className="text-xl mb-0.5">+</div>
                            <div className="text-[10px] text-muted-foreground">{t("admin.builder.dropHere")}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {!preview && (
            <Button variant="outline" className="w-full rounded-full border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary/40" onClick={addPage}>
              <Plus className="mr-2 h-4 w-4" /> {t("admin.builder.addPage")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

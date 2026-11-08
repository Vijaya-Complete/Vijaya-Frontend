import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Camera, Paintbrush, RotateCcw, RotateCw, Eraser, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/submit/drawing")({ component: SubmitDrawing });

type Method = "choose" | "upload" | "canvas";
type Tool = "brush" | "eraser";

const COLORS = ["#e63027","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#14b8a6","#000000","#6b7280","#ffffff","#92400e"];
const SIZES = [4, 8, 16, 28];

function SubmitDrawing() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [method, setMethod] = useState<Method>("choose");
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", ageGroup: "" });

  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#e63027");
  const [size, setSize] = useState(8);
  const [tool, setTool] = useState<Tool>("brush");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  useEffect(() => {
    if (method !== "canvas") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
  }, [method]);

  const saveSnapshot = () => {
    const ctx = getCtx(); if (!ctx || !canvasRef.current) return;
    const snap = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory(h => { const n = h.slice(0, histIdx + 1); n.push(snap); return n; });
    setHistIdx(i => i + 1);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!; const rect = canvas.getBoundingClientRect();
    if ("touches" in e) { const t = e.touches[0]; return { x: t.clientX - rect.left, y: t.clientY - rect.top }; }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); setDrawing(true);
    const ctx = getCtx(); if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? size * 3 : size;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); if (!drawing) return;
    const ctx = getCtx(); if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y); ctx.stroke();
  };

  const endDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); if (!drawing) return;
    setDrawing(false); saveSnapshot();
  };

  const undo = () => {
    if (histIdx <= 0) return;
    const ctx = getCtx(); if (!ctx || !canvasRef.current) return;
    const ni = histIdx - 1; setHistIdx(ni);
    ctx.putImageData(history[ni], 0, 0);
  };

  const redo = () => {
    if (histIdx >= history.length - 1) return;
    const ctx = getCtx(); if (!ctx || !canvasRef.current) return;
    const ni = histIdx + 1; setHistIdx(ni);
    ctx.putImageData(history[ni], 0, 0);
  };

  const clearCanvas = () => {
    const ctx = getCtx(); if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveSnapshot();
  };

  const getCanvasFile = (): File | null => {
    const canvas = canvasRef.current; if (!canvas) return null;
    const dataUrl = canvas.toDataURL("image/png");
    const arr = dataUrl.split(","); const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], "drawing.png", { type: mime });
  };

  const pickFile = (f: File | null) => {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleCamera = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.capture = "environment";
    input.onchange = (e) => pickFile((e.target as HTMLInputElement).files?.[0] ?? null);
    input.click();
  };

  const nextStep = () => {
    if (method === "canvas") { const f = getCanvasFile(); if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }
    setStep(2);
  };

  const submit = () => {
    if (!form.title.trim()) return toast.error("Please add a title");
    if (!form.ageGroup) return toast.error("Please select your age group");
    const finalFile = method === "canvas" ? getCanvasFile() : file;
    if (!finalFile) return toast.error("Please add your drawing");
    toast.success(t("submit.success"));
    nav({ to: "/dashboard" });
  };

  if (method === "choose") return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">{t("submit.drawingTitle")}</h1>
      <p className="text-muted-foreground mb-8">{t("submit.chooseMethod")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <button onClick={() => setMethod("upload")} className="card-lift rounded-3xl border-2 border-border bg-card p-8 text-left hover:border-primary transition-colors">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 mb-4"><Upload className="h-7 w-7 text-primary" /></div>
          <div className="font-display text-xl font-bold">{t("submit.uploadOption")}</div>
          <div className="text-sm text-muted-foreground mt-1">{t("submit.uploadDesc")}</div>
        </button>
        <button onClick={() => setMethod("canvas")} className="card-lift rounded-3xl border-2 border-border bg-card p-8 text-left hover:border-primary transition-colors">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sunshine/30 mb-4"><Paintbrush className="h-7 w-7 text-sunshine-foreground" /></div>
          <div className="font-display text-xl font-bold">{t("submit.canvasOption")}</div>
          <div className="text-sm text-muted-foreground mt-1">{t("submit.canvasDesc")}</div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setMethod("choose"); setStep(1); setFile(null); setPreview(null); }}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-2xl font-bold">{t("submit.drawingTitle")}</h1>
        <div className="ml-auto flex gap-2">
          <span className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-primary" : "bg-border"}`} />
          <span className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`} />
        </div>
      </div>

      {step === 1 && method === "upload" && (
        <div className="space-y-4">
          <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/60 transition-colors">
            {preview ? <img src={preview} alt="" className="h-full w-full rounded-3xl object-contain" /> : (
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <div className="font-semibold">Tap to upload</div>
                <div className="text-sm text-muted-foreground">JPG, PNG, WEBP, GIF up to 10MB</div>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
          </label>
          <Button variant="outline" className="w-full rounded-full" onClick={handleCamera}>
            <Camera className="mr-2 h-4 w-4" /> {t("submit.capturePhoto")}
          </Button>
          <Button className="w-full rounded-full" disabled={!file} onClick={nextStep}>
            {t("nav.submit")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 1 && method === "canvas" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
            <div className="flex gap-1">
              <button onClick={() => setTool("brush")} className={`rounded-xl p-2 transition ${tool === "brush" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}><Paintbrush className="h-4 w-4" /></button>
              <button onClick={() => setTool("eraser")} className={`rounded-xl p-2 transition ${tool === "eraser" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}><Eraser className="h-4 w-4" /></button>
            </div>
            <div className="flex gap-1">
              {SIZES.map(s => <button key={s} onClick={() => setSize(s)} className={`rounded-full border-2 transition ${size === s ? "border-primary" : "border-border"}`} style={{ width: s + 12, height: s + 12, backgroundColor: color }} />)}
            </div>
            <div className="flex gap-1 flex-wrap">
              {COLORS.map(c => <button key={c} onClick={() => { setColor(c); setTool("brush"); }} className={`rounded-full border-2 transition ${color === c && tool === "brush" ? "border-primary scale-125" : "border-transparent"}`} style={{ width: 22, height: 22, backgroundColor: c, boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #ddd" : undefined }} />)}
            </div>
            <div className="flex gap-1 ml-auto">
              <button onClick={undo} disabled={histIdx <= 0} className="rounded-xl p-2 hover:bg-secondary disabled:opacity-30"><RotateCcw className="h-4 w-4" /></button>
              <button onClick={redo} disabled={histIdx >= history.length - 1} className="rounded-xl p-2 hover:bg-secondary disabled:opacity-30"><RotateCw className="h-4 w-4" /></button>
              <button onClick={clearCanvas} className="rounded-xl p-2 hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full rounded-3xl border-2 border-border bg-white touch-none"
            style={{ height: 380, cursor: tool === "eraser" ? "cell" : "crosshair" }}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          />
          <Button className="w-full rounded-full" onClick={nextStep}>
            {t("nav.submit")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          {preview && <img src={preview} alt="" className="w-full max-h-60 object-contain rounded-2xl border border-border" />}
          <div><Label>{t("submit.fields.title")} *</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 rounded-xl" maxLength={120} /></div>
          <div><Label>{t("submit.fields.description")}</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 rounded-xl" maxLength={500} /></div>
          <div>
            <Label>{t("submit.fields.ageGroup")} *</Label>
            <Select value={form.ageGroup} onValueChange={v => setForm({ ...form, ageGroup: v })}>
              <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5-8">{t("gallery.ages5_8")}</SelectItem>
                <SelectItem value="9-12">{t("gallery.ages9_12")}</SelectItem>
                <SelectItem value="13-17">{t("gallery.ages13_17")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">{t("submit.rules")}</p>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full flex-1" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
            <Button className="rounded-full flex-1" onClick={submit}>{t("submit.submit")}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

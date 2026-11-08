import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Upload, FileText, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, ArrowLeft, ArrowRight, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/submit/story")({ component: SubmitStory });

type Method = "choose" | "write" | "pdf" | "pdf-edit";

function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  const editorRef = useRef<HTMLDivElement>(null);
  const words = value.trim().split(/\s+/).filter(Boolean).length;
  const exec = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); editorRef.current?.focus(); };
  const insertImage = () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/*";
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => exec("insertImage", ev.target?.result as string);
      reader.readAsDataURL(f);
    };
    input.click();
  };
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-border bg-secondary/40 p-2">
        {[["bold","Bold",<Bold className="h-3.5 w-3.5"/>],["italic","Italic",<Italic className="h-3.5 w-3.5"/>],["underline","Underline",<Underline className="h-3.5 w-3.5"/>]].map(([cmd,,icon]) => (
          <button key={cmd as string} onMouseDown={e => { e.preventDefault(); exec(cmd as string); }} className="rounded-lg p-1.5 hover:bg-card transition">{icon as React.ReactNode}</button>
        ))}
        <span className="w-px bg-border mx-1" />
        {[["justifyLeft",<AlignLeft className="h-3.5 w-3.5"/>],["justifyCenter",<AlignCenter className="h-3.5 w-3.5"/>],["justifyRight",<AlignRight className="h-3.5 w-3.5"/>]].map(([cmd,icon]) => (
          <button key={cmd as string} onMouseDown={e => { e.preventDefault(); exec(cmd as string); }} className="rounded-lg p-1.5 hover:bg-card transition">{icon as React.ReactNode}</button>
        ))}
        <span className="w-px bg-border mx-1" />
        <button onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }} className="rounded-lg p-1.5 hover:bg-card transition"><List className="h-3.5 w-3.5" /></button>
        <button onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }} className="rounded-lg p-1.5 hover:bg-card transition"><ListOrdered className="h-3.5 w-3.5" /></button>
        <span className="w-px bg-border mx-1" />
        <button onMouseDown={e => { e.preventDefault(); insertImage(); }} className="rounded-lg p-1.5 hover:bg-card transition"><Image className="h-3.5 w-3.5" /></button>
        <select onMouseDown={e => e.stopPropagation()} onChange={e => exec("fontSize", e.target.value)} className="rounded-lg border border-border bg-card px-1 text-xs" defaultValue="3">
          <option value="1">Small</option><option value="3">Normal</option><option value="5">Large</option>
        </select>
        <span className="ml-auto text-xs text-muted-foreground self-center">{words} {t("submit.wordCount")}</span>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[260px] p-4 text-sm outline-none font-body"
        onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        data-placeholder={t("submit.fields.body")}
        style={{ lineHeight: 1.7 }}
      />
    </div>
  );
}

function SubmitStory() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [method, setMethod] = useState<Method>("choose");
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [body, setBody] = useState("");
  const [form, setForm] = useState({ title: "", type: "", ageGroup: "" });

  const pickPdf = (f: File | null) => {
    if (f && f.size > 20 * 1024 * 1024) return toast.error("PDF must be under 20MB");
    setFile(f);
  };

  const submit = () => {
    if (!form.title.trim()) return toast.error("Please add a title");
    if (!form.type) return toast.error("Please select a type");
    if (!form.ageGroup) return toast.error("Please select your age group");
    if ((method === "write" || method === "pdf-edit") && !body.trim()) return toast.error("Please write your content");
    if (method === "pdf" && !file) return toast.error("Please upload a PDF");
    toast.success(t("submit.success"));
    nav({ to: "/dashboard" });
  };

  const methodCards = [
    { id: "write", icon: <BookOpen className="h-7 w-7 text-primary" />, bg: "bg-primary/10", label: t("submit.writeOption"), desc: t("submit.writeDesc") },
    { id: "pdf", icon: <FileText className="h-7 w-7 text-sunshine-foreground" />, bg: "bg-sunshine/30", label: t("submit.uploadPdfOption"), desc: t("submit.uploadPdfDesc") },
    { id: "pdf-edit", icon: <Upload className="h-7 w-7 text-mint" />, bg: "bg-mint/20", label: t("submit.uploadEditOption"), desc: t("submit.uploadEditDesc") },
  ];

  if (method === "choose") return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">{t("submit.storyTitle")}</h1>
      <p className="text-muted-foreground mb-8">{t("submit.chooseMethod")}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {methodCards.map(m => (
          <button key={m.id} onClick={() => setMethod(m.id as Method)} className="card-lift rounded-3xl border-2 border-border bg-card p-6 text-left hover:border-primary transition-colors">
            <div className={`grid h-12 w-12 place-items-center rounded-2xl mb-3 ${m.bg}`}>{m.icon}</div>
            <div className="font-display text-lg font-bold">{m.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setMethod("choose"); setStep(1); }}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-2xl font-bold">{t("submit.storyTitle")}</h1>
        <div className="ml-auto flex gap-2">
          <span className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-primary" : "bg-border"}`} />
          <span className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`} />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          {(method === "write" || method === "pdf-edit") && (
            <>
              {method === "pdf-edit" && (
                <div>
                  <Label>Upload PDF (will import text into editor)</Label>
                  <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-border p-4 hover:bg-secondary/40 transition-colors">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-sm">{file ? file.name : "Click to upload PDF"}</div>
                      <div className="text-xs text-muted-foreground">Max 20MB</div>
                    </div>
                    <input type="file" accept="application/pdf" className="hidden" onChange={e => pickPdf(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              )}
              <div><Label>{t("submit.fields.body")}</Label><div className="mt-1"><RichEditor value={body} onChange={setBody} /></div></div>
            </>
          )}
          {method === "pdf" && (
            <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/60 transition-colors">
              <FileText className="h-12 w-12 text-muted-foreground mb-3" />
              <div className="font-semibold">{file ? file.name : "Tap to upload PDF"}</div>
              <div className="text-sm text-muted-foreground">Max 20MB</div>
              <input type="file" accept="application/pdf" className="hidden" onChange={e => pickPdf(e.target.files?.[0] ?? null)} />
            </label>
          )}
          <Button className="w-full rounded-full" onClick={() => setStep(2)}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div><Label>{t("submit.fields.title")} *</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 rounded-xl" maxLength={120} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{t("submit.fields.type")} *</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {["Poem","Short Story","Article","Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
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

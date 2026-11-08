import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/content")({
  head: () => ({ meta: [{ title: "Site Content — Admin" }] }),
  component: AdminContent,
});

function AdminContent() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"about" | "contact" | "guidelines">("about");
  const [about, setAbout] = useState("Vijaya is a children's magazine created for kids, by kids. We celebrate creativity in every language and every medium.\n\nOur mission is to give every child a stage — and a printed page — for their imagination.");
  const [contact, setContact] = useState({ email:"vijaya@magazine.lk", phone:"+94 11 234 5678", address:"123 Lake Road, Colombo 03", facebook:"", instagram:"" });
  const [guidelines, setGuidelines] = useState("1. All submissions must be the original work of the child.\n2. Images must be in JPG, PNG or WEBP format, under 10MB.\n3. Stories and poems must be under 2000 words.\n4. All content must be kind and family-friendly.\n5. A parent or guardian must approve the submission.\n6. The editorial team has final say on all selections.");

  const save = () => toast.success(t("admin.content.saved") + " ✓");

  const TABS = [
    { id: "about",      label: t("admin.content.aboutTab") },
    { id: "contact",    label: t("admin.content.contactTab") },
    { id: "guidelines", label: t("admin.content.guidelinesTab") },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.content.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Changes go live on the public site immediately after saving</p>
        </div>
        <Button className="rounded-full shadow-playful" onClick={save}>
          <Save className="mr-2 h-4 w-4" /> {t("admin.content.save")}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-full border border-border overflow-hidden shadow-playful w-fit">
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`px-5 py-2 text-sm font-semibold transition ${tab === tb.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
            {tb.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
        {tab === "about" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This content appears on the public About page.</p>
            <div>
              <Label>About page content</Label>
              <Textarea value={about} onChange={e => setAbout(e.target.value)} className="mt-2 rounded-2xl min-h-[280px] font-body text-sm" />
            </div>
            <div className="rounded-2xl bg-secondary/40 p-4">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Live preview</div>
              <div className="text-sm whitespace-pre-line">{about}</div>
            </div>
          </div>
        )}

        {tab === "contact" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">These details appear on the public Contact page.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Email address</Label><Input value={contact.email} onChange={e => setContact({ ...contact, email:e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label>Phone number</Label><Input value={contact.phone} onChange={e => setContact({ ...contact, phone:e.target.value })} className="mt-1 rounded-xl" /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input value={contact.address} onChange={e => setContact({ ...contact, address:e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label>Facebook URL</Label><Input placeholder="https://facebook.com/..." value={contact.facebook} onChange={e => setContact({ ...contact, facebook:e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label>Instagram URL</Label><Input placeholder="https://instagram.com/..." value={contact.instagram} onChange={e => setContact({ ...contact, instagram:e.target.value })} className="mt-1 rounded-xl" /></div>
            </div>
          </div>
        )}

        {tab === "guidelines" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Submission guidelines shown to contributors before they submit.</p>
            <div>
              <Label>Guidelines content</Label>
              <Textarea value={guidelines} onChange={e => setGuidelines(e.target.value)} className="mt-2 rounded-2xl min-h-[280px] font-body text-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

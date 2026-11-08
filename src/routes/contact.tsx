import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vijaya" },
      { name: "description", content: "Get in touch with the Vijaya editorial team — questions, schools, partnerships." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0]?.message ?? "Please fix the form");
      return;
    }
    toast.success(t("contact.sent"));
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_1fr]">
      <div>
        <h1 className="font-display text-5xl font-bold">{t("contact.title")}</h1>
        <p className="mt-3 max-w-md text-muted-foreground">{t("contact.lead")}</p>
        <div className="mt-8 space-y-4 text-sm">
          <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> hello@vijaya.lk</div>
          <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +94 11 234 5678</div>
          <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Colombo, Sri Lanka</div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
        <div>
          <Label>{t("contact.name")}</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 rounded-xl" maxLength={100} />
        </div>
        <div>
          <Label>{t("contact.email")}</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 rounded-xl" maxLength={255} />
        </div>
        <div>
          <Label>{t("contact.message")}</Label>
          <Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 rounded-xl" maxLength={1000} />
        </div>
        <Button type="submit" className="w-full rounded-full"><Send className="mr-1 h-4 w-4" />{t("contact.send")}</Button>
      </form>
    </div>
  );
}

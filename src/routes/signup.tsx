import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Vijaya" }, { name: "description", content: "Create your free Vijaya account." }] }),
  component: SignupPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  age: z.coerce.number().int().min(4).max(99),
  school: z.string().trim().max(200).optional(),
  password: z.string().min(6).max(200),
});

function SignupPage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", age: "", school: "", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) return toast.error(r.error.issues[0]?.message ?? "Please check your details");
    localStorage.setItem("vijaya_token", "mock-token");
    localStorage.setItem("vijaya_user", JSON.stringify({ name: form.name, email: form.email }));
    toast.success("Welcome to Vijaya! 🎉");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-6 py-10">
      <form onSubmit={submit} className="w-full rounded-3xl border border-border/60 bg-card p-8 shadow-playful">
        <h1 className="font-display text-3xl font-bold">{t("auth.signupTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.signupSub")}</p>

        <div className="mt-6 space-y-4">
          <div><Label>{t("auth.name")}</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 rounded-xl" maxLength={100} /></div>
          <div><Label>{t("auth.email")}</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 rounded-xl" maxLength={255} /></div>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <div><Label>{t("auth.age")}</Label><Input type="number" min={4} max={99} required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="mt-1 rounded-xl" /></div>
            <div><Label>{t("auth.school")}</Label><Input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="mt-1 rounded-xl" maxLength={200} /></div>
          </div>
          <div><Label>{t("auth.password")}</Label><Input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 rounded-xl" /></div>
          <Button type="submit" className="w-full rounded-full">{t("auth.signup")}</Button>
        </div>
        <div className="mt-5 text-center text-sm">
          <span className="text-muted-foreground">{t("auth.haveAccount")} </span>
          <Link to="/login" className="font-semibold text-primary hover:underline">{t("auth.login")}</Link>
        </div>
      </form>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Vijaya" }] }),
  component: ResetPassword,
});

const schema = z
  .object({
    password: z.string().min(8).max(128),
    confirm: z.string().min(8).max(128),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords must match" });

function ResetPassword() {
  const nav = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) return toast.error(r.error.issues[0]?.message ?? "Check the form");
    toast.success("Password updated — please log in.");
    nav({ to: "/login" });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-playful">
        <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-bold">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pick something memorable — at least 8 characters.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>New password</Label>
            <Input required type="password" minLength={8} maxLength={128}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label>Confirm password</Label>
            <Input required type="password" minLength={8} maxLength={128}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="mt-1 rounded-xl" />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full">Update password</Button>
        </form>
      </div>
    </div>
  );
}

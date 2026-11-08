import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Vijaya" }] }),
  component: ForgotPassword,
});

const schema = z.object({ email: z.string().trim().email().max(255) });

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email });
    if (!r.success) return toast.error("Enter a valid email");
    setSent(true);
    toast.success("Check your inbox for a reset link");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <Link to="/login" className="mb-6 text-sm text-muted-foreground hover:text-primary">← Back to log in</Link>
      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-playful">
        <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-sunshine text-sunshine-foreground">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-bold">{t("auth.forgotTitle", "Forgot your password?")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("auth.forgotLead", "Enter the email you signed up with. We'll send you a link to reset your password.")}</p>

        {sent ? (
          <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-sm">
            If <span className="font-semibold">{email}</span> matches an account, a reset link is on its way.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                required
                type="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 rounded-xl"
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-full">Send reset link</Button>
          </form>
        )}
      </div>
    </div>
  );
}

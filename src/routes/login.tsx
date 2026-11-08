import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { tryLogin, saveSession } from "@/lib/auth";
import logo from "@/assets/logo.jpeg";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Vijaya" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return toast.error("Please enter your email");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    setTimeout(() => {
      const user = tryLogin(form.email, form.password);
      setLoading(false);
      if (!user) { toast.error("Incorrect email or password"); return; }
      saveSession(user);
      if (user.role === "admin") {
        toast.success("Welcome, Admin! 👋");
        // Navigate to admin SPA (served from admin.html)
        window.location.href = "/admin.html";
      } else {
        toast.success(`Welcome back, ${user.name}! ✨`);
        nav({ to: "/dashboard" });
      }
    }, 600);
  };

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-6 py-10">
      <form onSubmit={submit} className="w-full">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-playful">
          {/* Logo + heading */}
          <div className="mb-7 flex flex-col items-center gap-2 text-center">
            <img src={logo} alt="Vijaya" className="h-16 w-16 rounded-2xl shadow-playful"/>
            <h1 className="font-display text-3xl font-bold">{t("auth.loginTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("auth.loginSub")}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" autoComplete="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="mt-1 rounded-xl" placeholder="you@example.com"/>
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPw ? "text" : "password"} autoComplete="current-password"
                  required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="rounded-xl pr-10" placeholder="••••••"/>
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Signing in…" : t("auth.login")}
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link to="/signup" className="font-semibold text-primary hover:underline">{t("auth.signup")}</Link>
            </span>
            <Link to="/forgot-password" className="text-muted-foreground hover:text-primary">{t("auth.forgot")}</Link>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 rounded-2xl border border-sunshine/60 bg-sunshine/20 p-4 text-sm">
          <p className="font-semibold text-sunshine-foreground mb-1">🔑 Demo credentials</p>
          <p className="text-muted-foreground">
            Admin: <span className="font-mono font-bold">admin@vijaya.lk</span> / <span className="font-mono font-bold">Vijaya@2025</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Any other email + 6-char password = regular user.</p>
        </div>
      </form>
    </div>
  );
}

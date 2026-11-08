import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard, BookOpen, Pencil, Star, Trophy, Layout,
  MessageSquare, Users, FileText, Inbox, ClipboardList, Menu, X,
  Bell, ChevronRight, LogOut, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getSession, clearSession } from "@/lib/auth";
import logo from "@/assets/logo.jpeg";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const NAV_LINKS = (t: (k: string) => string) => [
  { to: "/admin/overview",  icon: LayoutDashboard, label: t("admin.nav.overview") },
  { to: "/admin/issues",    icon: BookOpen,         label: t("admin.nav.issues") },
  { to: "/admin/drawings",  icon: Pencil,           label: t("admin.nav.drawings") },
  { to: "/admin/stories",   icon: FileText,         label: t("admin.nav.stories") },
  { to: "/admin/top30",     icon: Star,             label: t("admin.nav.top30") },
  { to: "/admin/top3",      icon: Trophy,           label: t("admin.nav.top3") },
  { to: "/admin/builder",   icon: Layout,           label: t("admin.nav.magazineBuilder") },
  { to: "/admin/reviews",   icon: MessageSquare,    label: t("admin.nav.reviews") },
  { to: "/admin/users",     icon: Users,            label: t("admin.nav.users") },
  { to: "/admin/content",   icon: FileText,         label: t("admin.nav.content") },
  { to: "/admin/inbox",     icon: Inbox,            label: t("admin.nav.inbox") },
  { to: "/admin/audit",     icon: ClipboardList,    label: t("admin.nav.auditLog") },
];

function AdminLayout() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    const user = getSession();
    if (!user || user.role !== "admin") {
      toast.error("Admin access required");
      nav({ to: "/login" });
    }
  }, [nav]);

  const logout = () => {
    clearSession();
    nav({ to: "/" });
  };

  const links = NAV_LINKS(t);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Sidebar header — matches user navbar style */}
      <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
        <img src={logo} alt="Vijaya" className="h-9 w-9 rounded-xl shadow-playful" />
        <div>
          <div className="font-display font-bold text-primary leading-tight">{t("brand")}</div>
          <div className="text-xs text-muted-foreground leading-tight">Editor's Desk</div>
        </div>
        <button className="ml-auto rounded-xl p-1.5 hover:bg-secondary md:hidden" onClick={() => setMobileOpen(false)}>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all
                ${active
                  ? "bg-primary text-primary-foreground shadow-playful"
                  : "text-foreground/70 hover:bg-secondary hover:text-primary"}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="border-t border-border/60 p-3 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground/70 hover:bg-secondary hover:text-primary transition-all"
        >
          <Home className="h-4 w-4" /> View site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="h-4 w-4" /> {t("nav.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-border/60 bg-card shadow-playful
        transition-transform duration-300
        md:static md:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SidebarContent />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Top bar — same style as public navbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-card/80 backdrop-blur-md px-6 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 hover:bg-secondary transition md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-display font-bold text-primary">{t("brand")}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">
              {links.find(l => l.to === location)?.label ?? "Admin"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link to="/notifications"><Bell className="h-5 w-5" /></Link>
            </Button>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5">
              <div className="h-6 w-6 rounded-full bg-primary grid place-items-center">
                <span className="text-xs font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-sm font-semibold hidden sm:inline">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

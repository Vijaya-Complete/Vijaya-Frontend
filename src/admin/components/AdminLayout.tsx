import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard, BookOpen, Pencil, FileText, Star, Trophy,
  Layout, MessageSquare, Users, Settings, Inbox, ClipboardList,
  TrendingUp, ChevronDown, ChevronRight, Menu, X, LogOut,
  Home, Bell,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getSession, clearSession } from "@/lib/auth";
import logo from "@/assets/logo.jpeg";

export type AdminPage =
  | "overview" | "issues"  | "drawings" | "stories"
  | "top30"    | "top3"    | "builder"  | "reviews"
  | "users"    | "content" | "inbox"    | "audit" | "revenue";

interface Props { current: AdminPage; onNav: (p: AdminPage) => void; children: ReactNode; }

// ── Sidebar nav structure ────────────────────────────────────────
const NAV = (t: (k: string) => string) => [
  {
    id: "overview" as AdminPage,
    icon: LayoutDashboard,
    label: t("admin.nav.overview"),
    children: [],
  },
  {
    id: "submissions",
    icon: Pencil,
    label: "Submissions",
    children: [
      { id: "drawings" as AdminPage, icon: Pencil,       label: t("admin.nav.drawings") },
      { id: "stories"  as AdminPage, icon: FileText,     label: t("admin.nav.stories")  },
      { id: "reviews"  as AdminPage, icon: MessageSquare,label: t("admin.nav.reviews")  },
    ],
  },
  {
    id: "curation",
    icon: Star,
    label: "Curation",
    children: [
      { id: "top30"   as AdminPage, icon: Star,   label: t("admin.nav.top30")          },
      { id: "top3"    as AdminPage, icon: Trophy, label: t("admin.nav.top3")           },
      { id: "builder" as AdminPage, icon: Layout, label: t("admin.nav.magazineBuilder") },
    ],
  },
  {
    id: "manage",
    icon: Settings,
    label: "Manage",
    children: [
      { id: "issues"  as AdminPage, icon: BookOpen,     label: t("admin.nav.issues")   },
      { id: "users"   as AdminPage, icon: Users,         label: t("admin.nav.users")    },
      { id: "revenue" as AdminPage, icon: TrendingUp,    label: t("admin.revenue.title") },
      { id: "content" as AdminPage, icon: Settings,      label: t("admin.nav.content")  },
      { id: "inbox"   as AdminPage, icon: Inbox,         label: t("admin.nav.inbox")    },
      { id: "audit"   as AdminPage, icon: ClipboardList, label: t("admin.nav.auditLog") },
    ],
  },
];

export function AdminLayout({ current, onNav, children }: Props) {
  const { t } = useTranslation();
  const user = getSession();

  // Which group is open — auto-open the group that contains the current page
  const findGroupForPage = (page: AdminPage): string | null => {
    for (const group of NAV(t)) {
      if (group.children.some((c: any) => c.id === page)) return group.id;
    }
    return null;
  };

  const [openGroup, setOpenGroup] = useState<string | null>(
    findGroupForPage(current) ?? "submissions"
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const logout = () => { clearSession(); window.location.href = "/"; };

  const navigate = (page: AdminPage) => {
    onNav(page);
    setMobileSidebarOpen(false);
  };

  const toggleGroup = (id: string) =>
    setOpenGroup(prev => (prev === id ? null : id));

  // ── Sidebar inner ──────────────────────────────────────────────
  const SidebarInner = () => (
    <div className="flex h-full flex-col bg-card border-r border-border/60">

      {/* Logo block */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60">
        <img src={logo} alt="Vijaya" className="h-10 w-10 rounded-xl shadow-playful flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-display text-lg font-bold text-primary leading-tight">{t("brand")}</div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Editor's Desk
          </div>
        </div>
        {/* Close button on mobile */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="ml-auto rounded-xl p-1.5 hover:bg-secondary transition md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV(t).map(item => {
          // Leaf item (Overview)
          if (item.children.length === 0) {
            const active = current === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id as AdminPage)}
                className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all text-left
                  ${active
                    ? "bg-primary text-primary-foreground shadow-playful"
                    : "text-foreground/70 hover:bg-secondary hover:text-primary"}`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
              </button>
            );
          }

          // Group item
          const groupActive = item.children.some((c: any) => c.id === current);
          const isOpen = openGroup === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(item.id)}
                className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all text-left
                  ${groupActive
                    ? "text-primary bg-primary/8"
                    : "text-foreground/70 hover:bg-secondary hover:text-primary"}`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Children */}
              {isOpen && (
                <div className="mt-0.5 ml-3 pl-3 border-l-2 border-border/60 space-y-0.5">
                  {item.children.map((child: any) => {
                    const childActive = current === child.id;
                    const ChildIcon = child.icon;
                    return (
                      <button
                        key={child.id}
                        onClick={() => navigate(child.id)}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all text-left
                          ${childActive
                            ? "bg-primary text-primary-foreground shadow-playful font-semibold"
                            : "text-foreground/65 hover:bg-secondary hover:text-primary"}`}
                      >
                        <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        {child.label}
                        {childActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="border-t border-border/60 p-2 space-y-0.5">
        <a
          href="/"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground/70 hover:bg-secondary hover:text-primary transition-all"
        >
          <Home className="h-4 w-4 flex-shrink-0" /> View site
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all text-left"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" /> {t("nav.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar — desktop always visible, mobile slide-in ──── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300
          md:static md:translate-x-0 md:z-auto
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarInner />
      </aside>

      {/* ── Main area ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center gap-3 border-b border-border/60 bg-card/80 backdrop-blur-md px-5 py-3">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-xl p-2 hover:bg-secondary transition md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page breadcrumb */}
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="font-display font-bold text-primary hidden md:block">{t("brand")}</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
            <span className="font-semibold text-foreground truncate">
              {/* Find current page label */}
              {NAV(t).flatMap((g: any) =>
                g.children.length === 0
                  ? [{ id: g.id, label: g.label }]
                  : g.children
              ).find((c: any) => c.id === current)?.label ?? "Admin"}
            </span>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />

            <button className="relative rounded-full p-2 hover:bg-secondary transition">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center">
                2
              </span>
            </button>

            {/* Admin chip */}
            <div className="relative group">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 pl-2 pr-3 py-1.5 cursor-pointer select-none">
                <div className="h-7 w-7 rounded-full bg-primary grid place-items-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">A</span>
                </div>
                <span className="text-sm font-semibold hidden sm:inline">{user?.name ?? "Admin"}</span>
              </div>
              {/* Mini dropdown */}
              <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border/60 bg-card shadow-playful
                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <a href="/" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition">
                  <Home className="h-4 w-4" /> View site
                </a>
                <button onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition border-t border-border/40">
                  <LogOut className="h-4 w-4" /> {t("nav.logout")}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}

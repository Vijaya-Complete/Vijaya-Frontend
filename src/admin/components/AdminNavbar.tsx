import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, LogOut, Menu, X, ChevronDown, User } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { getSession, clearSession } from "@/lib/auth";
import logo from "@/assets/logo.jpeg";

type AdminPage = "overview"|"issues"|"drawings"|"stories"|"top30"|"top3"|"builder"|"reviews"|"users"|"content"|"inbox"|"audit"|"revenue";

interface Props { current: AdminPage; onNav: (page: AdminPage) => void; }

const NAV_GROUPS = [
  { label:"Submissions", items:[{id:"drawings" as AdminPage,label:"Drawings"},{id:"stories" as AdminPage,label:"Stories & Poems"},{id:"reviews" as AdminPage,label:"Reviews"}] },
  { label:"Curation",    items:[{id:"top30" as AdminPage,label:"Top 30"},{id:"top3" as AdminPage,label:"Top 3"},{id:"builder" as AdminPage,label:"Magazine Builder"}] },
  { label:"Manage",      items:[{id:"issues" as AdminPage,label:"Issues"},{id:"users" as AdminPage,label:"Users"},{id:"content" as AdminPage,label:"Site Content"},{id:"inbox" as AdminPage,label:"Inbox"},{id:"audit" as AdminPage,label:"Audit Log"},{id:"revenue" as AdminPage,label:"Revenue"}] },
];

export function AdminNavbar({ current, onNav }: Props) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string|null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn); fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const logout = () => { clearSession(); window.location.href = "/"; };
  const go = (page: AdminPage) => { onNav(page); setMobileOpen(false); setOpenGroup(null); };
  const user = getSession();

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? "glass-nav border-b border-border/60 shadow-sm" : "bg-background/0"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">

          {/* Logo */}
          <button onClick={() => go("overview")} className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Vijaya" className="h-10 w-10 rounded-xl shadow-playful" />
            <div className="leading-tight text-left">
              <div className="font-display text-2xl font-bold text-primary">{t("brand")}</div>
              <div className="text-[10px] font-semibold text-muted-foreground -mt-0.5 uppercase tracking-widest">Editor's Desk</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            <button onClick={() => go("overview")}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${current==="overview" ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-secondary hover:text-primary"}`}>
              Overview
            </button>
            {NAV_GROUPS.map(group => {
              const groupActive = group.items.some(i => i.id === current);
              const isOpen = openGroup === group.label;
              return (
                <div key={group.label} className="relative">
                  <button onMouseEnter={() => setOpenGroup(group.label)} onMouseLeave={() => setOpenGroup(null)}
                    onClick={() => setOpenGroup(isOpen ? null : group.label)}
                    className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition ${groupActive ? "bg-secondary text-primary" : "text-foreground/75 hover:bg-secondary hover:text-primary"}`}>
                    {group.label} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div onMouseEnter={() => setOpenGroup(group.label)} onMouseLeave={() => setOpenGroup(null)}
                      className="absolute left-0 top-full mt-1 w-48 rounded-2xl border border-border/60 bg-card shadow-playful overflow-hidden z-50">
                      {group.items.map(item => (
                        <button key={item.id} onClick={() => go(item.id)}
                          className={`flex w-full items-center px-4 py-2.5 text-sm font-semibold transition ${current===item.id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground/80"}`}>
                          {item.label}
                          {current===item.id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"/>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center">2</span>
            </Button>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 cursor-pointer group relative">
              <div className="h-7 w-7 rounded-full bg-primary grid place-items-center flex-shrink-0">
                <span className="text-xs font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-sm font-semibold">{user?.name ?? "Admin"}</span>
              <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border/60 bg-card shadow-playful opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <a href="/" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition"><User className="h-4 w-4" /> View site</a>
                <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition border-t border-border/40"><LogOut className="h-4 w-4" /> {t("nav.logout")}</button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-border/60 bg-card/95 backdrop-blur-sm px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              <button onClick={() => go("overview")} className={`rounded-xl px-3 py-2.5 text-sm font-semibold text-left transition ${current==="overview" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>Overview</button>
              {NAV_GROUPS.map(group => (
                <div key={group.label}>
                  <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">{group.label}</div>
                  {group.items.map(item => (
                    <button key={item.id} onClick={() => go(item.id)}
                      className={`w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-left transition ${current===item.id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground/80"}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
              <div className="border-t border-border/40 pt-2 mt-1">
                <button onClick={logout} className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive text-left hover:bg-destructive/5">
                  <LogOut className="inline mr-2 h-4 w-4" /> {t("nav.logout")}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Menu, User, X, Search, ShoppingBag, ShieldCheck, LogOut, LayoutDashboard } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession, clearSession, type AppUser } from "@/lib/auth";
import logo from "@/assets/logo.jpeg";

export function Navbar() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState("");
  const [user, setUser]             = useState<AppUser | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn); fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setUser(getSession()); }, []);

  const logout = () => { clearSession(); setUser(null); nav({ to: "/" }); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) { nav({ to: "/search", search: { q: searchQ } }); setSearchOpen(false); setSearchQ(""); }
  };

  const navLinks = [
    { to: "/",         label: t("nav.home")     },
    { to: "/drawings", label: t("nav.drawings") },
    { to: "/stories",  label: t("nav.stories")  },
    { to: "/top3",     label: t("nav.top3")     },
    { to: "/magazine", label: t("nav.magazine") },
    { to: "/buy",      label: t("magazine.preorder") },
    { to: "/about",    label: t("nav.about")    },
    { to: "/contact",  label: t("nav.contact")  },
  ] as const;

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <form className="mx-4 w-full max-w-lg" onSubmit={handleSearch} onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 rounded-2xl bg-card p-2 shadow-playful border border-border">
              <Search className="ml-2 h-5 w-5 text-muted-foreground flex-shrink-0"/>
              <Input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={t("search.placeholder")} className="border-0 bg-transparent focus-visible:ring-0 text-base"/>
              <button type="button" onClick={() => setSearchOpen(false)} className="rounded-xl p-1.5 hover:bg-secondary"><X className="h-4 w-4"/></button>
            </div>
          </form>
        </div>
      )}

      <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? "glass-nav border-b border-border/60 shadow-sm" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 md:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Vijaya" className="h-10 w-10 rounded-xl shadow-playful"/>
            <span className="font-display text-2xl font-bold text-primary">{t("brand")}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/75 transition hover:bg-secondary hover:text-primary"
                activeProps={{ className: "bg-secondary text-primary" }}
                activeOptions={{ exact: l.to === "/" }}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <LanguageToggle/>

            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5"/>
            </Button>

            {/* Buy button — always visible */}
            <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex rounded-full border-primary/40 text-primary hover:bg-primary/10">
              <Link to="/buy"><ShoppingBag className="mr-1.5 h-4 w-4"/>{t("magazine.preorder")}</Link>
            </Button>

            {user ? (
              <>
                <Button asChild variant="ghost" size="icon" className="relative rounded-full">
                  <Link to="/notifications">
                    <Bell className="h-5 w-5"/>
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center">3</span>
                  </Link>
                </Button>

                {/* User dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 pl-2 pr-3 py-1.5 hover:bg-secondary transition">
                    <div className="h-7 w-7 rounded-full bg-primary/20 grid place-items-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary"/>
                    </div>
                    <span className="hidden sm:inline text-sm font-semibold capitalize">{user.name.split(" ")[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border/60 bg-card shadow-playful opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    <div className="border-b border-border/40 px-4 py-3">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    {user.role === "admin"
                      ? <a href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-secondary transition"><ShieldCheck className="h-4 w-4"/> Admin panel</a>
                      : <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition"><LayoutDashboard className="h-4 w-4"/> {t("nav.dashboard")}</Link>
                    }
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition border-t border-border/40">
                      <User className="h-4 w-4"/> My profile
                    </Link>
                    <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition border-t border-border/40">
                      <LogOut className="h-4 w-4"/> {t("nav.logout")}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Button asChild className="hidden rounded-full px-5 sm:inline-flex">
                <Link to="/login"><User className="mr-1.5 h-4 w-4"/>{t("nav.login")}</Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-border/60 bg-card/95 backdrop-blur-sm px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-secondary transition"
                  activeProps={{ className: "bg-secondary text-primary" }}
                  activeOptions={{ exact: l.to === "/" }}>
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-border/40 pt-2 mt-1">
                {user ? (
                  <>
                    {user.role === "admin"
                      ? <a href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-secondary"><ShieldCheck className="h-4 w-4"/> Admin panel</a>
                      : <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-secondary">{t("nav.dashboard")}</Link>
                    }
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/5">
                      {t("nav.logout")}
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                    {t("nav.login")}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import logo from "@/assets/logo.jpeg";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Vijaya" className="h-12 w-12 rounded-2xl shadow-playful" />
            <div>
              <div className="font-display text-2xl font-bold text-primary">{t("brand")}</div>
              <div className="text-sm text-muted-foreground">{t("tagline")}</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            {t("footer.made")}
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-display text-base font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/drawings" className="hover:text-primary">{t("nav.drawings")}</Link></li>
            <li><Link to="/stories" className="hover:text-primary">{t("nav.stories")}</Link></li>
            <li><Link to="/magazine" className="hover:text-primary">{t("nav.magazine")}</Link></li>
            <li><Link to="/about" className="hover:text-primary">{t("nav.about")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-display text-base font-semibold">Language</h4>
          <LanguageToggle />
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full bg-secondary p-2 hover:bg-primary hover:text-primary-foreground"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="rounded-full bg-secondary p-2 hover:bg-primary hover:text-primary-foreground"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="rounded-full bg-secondary p-2 hover:bg-primary hover:text-primary-foreground"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("brand")} — {t("footer.rights")}
      </div>
    </footer>
  );
}

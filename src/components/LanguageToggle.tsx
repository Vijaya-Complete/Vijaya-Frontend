import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const langs = [
  { code: "en", label: "EN" },
  { code: "si", label: "සිං" },
  { code: "ta", label: "தமி" },
] as const;

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? "en";
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-secondary p-1 shadow-inner">
      {langs.map((l) => (
        <Button
          key={l.code}
          size="sm"
          variant="ghost"
          onClick={() => {
            void i18n.changeLanguage(l.code);
            try { localStorage.setItem("vijaya_lang", l.code); } catch { /* ignore */ }
          }}
          className={`h-7 rounded-full px-3 text-xs font-semibold transition ${
            current === l.code
              ? "bg-primary text-primary-foreground shadow-playful"
              : "text-foreground/70 hover:text-foreground"
          }`}
          aria-label={`Switch to ${l.label}`}
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
}

import { useEffect } from "react";
import i18n from "@/lib/i18n";

/** Reads the saved language from localStorage AFTER hydration and switches
 * i18next. Renders nothing; safe to mount once in __root. */
export function I18nClientLoader() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vijaya_lang");
      const lang = saved && ["en", "si", "ta"].includes(saved)
        ? saved
        : (navigator.language?.slice(0, 2) ?? "en");
      const final = ["en", "si", "ta"].includes(lang) ? lang : "en";
      if (i18n.language !== final) void i18n.changeLanguage(final);
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}

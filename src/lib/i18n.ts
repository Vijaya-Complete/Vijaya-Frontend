import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import si from "@/locales/si.json";
import ta from "@/locales/ta.json";

// IMPORTANT: do not use a LanguageDetector here — it reads localStorage on the
// client only, which causes an SSR/CSR hydration mismatch (React error #418).
// We always render with `en` on the server and the first client paint, then
// swap to the user's preferred language post-mount via <I18nClientLoader />.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      si: { translation: si },
      ta: { translation: ta },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "si", "ta"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;

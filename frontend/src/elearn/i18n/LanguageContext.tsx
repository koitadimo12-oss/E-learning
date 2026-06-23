import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LANG, type Lang } from "./languages";

const STORAGE_KEY = "knd_lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readLang(): Lang {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "fr" || raw === "en" || raw === "wo" || raw === "ar") return raw;
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readLang());

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    // IMPORTANT: même en arabe, on garde le layout identique (LTR).
    // On traduit uniquement les textes et la voix off.
    document.documentElement.dir = "ltr";
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage doit etre utilise dans LanguageProvider.");
  return ctx;
}


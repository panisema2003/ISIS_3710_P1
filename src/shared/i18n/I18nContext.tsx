"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import en, { Translations } from "./translations/en";
import es from "./translations/es";

type Locale = "en" | "es";

interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const translations: Record<Locale, Translations> = { en, es };

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

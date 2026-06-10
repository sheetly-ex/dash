import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createT, createTArray, type TranslationKey } from '../i18n';
import type { Language } from '../i18n/translations';

export type Theme = 'light' | 'dark';

interface SettingsContextValue {
  theme: Theme;
  language: Language;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey) => string;
  tArray: (key: TranslationKey) => readonly string[];
}

const LS_THEME = 'dash-theme';
const LS_LANG = 'dash-language';

const SettingsContext = createContext<SettingsContextValue | null>(null);

function loadTheme(): Theme {
  try {
    const v = localStorage.getItem(LS_THEME);
    if (v === 'dark' || v === 'light') return v;
  } catch { /* ignore */ }
  return 'light';
}

function loadLanguage(): Language {
  try {
    const v = localStorage.getItem(LS_LANG);
    if (v === 'ko' || v === 'en') return v;
  } catch { /* ignore */ }
  return 'ko';
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(loadTheme);
  const [language, setLanguageState] = useState<Language>(loadLanguage);

  const t = useMemo(() => createT(language), [language]);
  const tArray = useMemo(() => createTArray(language), [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(LS_THEME, theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem(LS_LANG, language); } catch { /* ignore */ }
  }, [language]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setLanguage = useCallback((l: Language) => setLanguageState(l), []);

  return (
    <SettingsContext.Provider value={{ theme, language, setTheme, setLanguage, t, tArray }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

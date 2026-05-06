'use client';

import { createContext, useContext, useEffect, useSyncExternalStore, ReactNode } from 'react';
import th from '@/locales/th.json';
import en from '@/locales/en.json';

type Language = 'th' | 'en';
const LANGUAGE_KEY = 'language';
const LANGUAGE_EVENT = 'trp-language-updated';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function readLanguage(): Language {
  if (typeof window === 'undefined') return 'th';

  const saved = localStorage.getItem(LANGUAGE_KEY);
  return saved === 'en' || saved === 'th' ? saved : 'th';
}

function subscribeToLanguageChanges(listener: () => void) {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(LANGUAGE_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(LANGUAGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore<Language>(subscribeToLanguageChanges, readLanguage, () => 'th');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(LANGUAGE_KEY, lang);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  };

  const t = (key: string): string => {
    const translations = language === 'th' ? th : en;
    const keys = key.split('.');
    let value: unknown = translations;
    
    for (const k of keys) {
      value =
        typeof value === 'object' && value !== null && k in value
          ? (value as Record<string, unknown>)[k]
          : undefined;
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

const defaultT = (key: string, lang: Language = 'th'): string => {
  const translations = lang === 'th' ? th : en;
  const keys = key.split('.');
  let value: unknown = translations;
  
  for (const k of keys) {
    value =
      typeof value === 'object' && value !== null && k in value
        ? (value as Record<string, unknown>)[k]
        : undefined;
  }
  
  return typeof value === 'string' ? value : key;
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return a default context when not within a provider
    // This prevents errors during server-side rendering/prerendering
    return {
      language: 'th' as Language,
      setLanguage: () => {},
      t: (key: string) => defaultT(key, 'th')
    };
  }
  return context;
}

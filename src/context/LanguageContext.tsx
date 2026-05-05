'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import th from '@/locales/th.json';
import en from '@/locales/en.json';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('th');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && (saved === 'th' || saved === 'en')) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function with nested key support (e.g., "nav.home")
  const t = (key: string): string => {
    const translations = language === 'th' ? th : en;
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Default translation function for use outside of context
const defaultT = (key: string, lang: Language = 'th'): string => {
  const translations = lang === 'th' ? th : en;
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
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

'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { ReactNode } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

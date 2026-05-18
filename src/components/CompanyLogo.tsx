'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';

import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { LOCAL_LOGO_URL_STORAGE_KEY } from '@/lib/admin/companySettings';

type CompanyLogoProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
};

export default function CompanyLogo({ alt = 'TRP Powers Plus', className = '', priority = false }: CompanyLogoProps) {
  const companyProfile = useCompanyProfile();
  const [localLogoUrl, setLocalLogoUrl] = useState(() =>
    typeof window === 'undefined' ? '' : window.localStorage.getItem(LOCAL_LOGO_URL_STORAGE_KEY) ?? '',
  );

  useEffect(() => {
    function handleLocalLogoChange(event: Event) {
      setLocalLogoUrl((event as CustomEvent<string>).detail || window.localStorage.getItem(LOCAL_LOGO_URL_STORAGE_KEY) || '');
    }

    window.addEventListener('trp-local-logo-change', handleLocalLogoChange);
    return () => window.removeEventListener('trp-local-logo-change', handleLocalLogoChange);
  }, []);

  return (
    <img
      src={localLogoUrl || companyProfile.logoUrl}
      alt={alt}
      width={208}
      height={64}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
    />
  );
}

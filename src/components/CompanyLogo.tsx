'use client';

/* eslint-disable @next/next/no-img-element */

import { useCompanyProfile } from '@/hooks/useCompanyProfile';

type CompanyLogoProps = {
  alt?: string;
  className?: string;
};

export default function CompanyLogo({ alt = 'TRP Powers Plus', className = '' }: CompanyLogoProps) {
  const companyProfile = useCompanyProfile();

  return <img src={companyProfile.logoUrl} alt={alt} className={className} />;
}

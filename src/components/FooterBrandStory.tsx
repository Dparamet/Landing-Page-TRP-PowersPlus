'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function FooterBrandStory() {
  const { t } = useLanguage();

  return (
    <div className="border-t border-slate-200 bg-[#eef4ff] px-4 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Image
          src="/images/LogoTRP.webp"
          alt="TRP Powers Plus"
          width={460}
          height={180}
          className="h-auto w-full max-w-[340px] md:max-w-[460px]"
        />
        <p className="mt-8 max-w-4xl text-balance text-2xl font-light leading-relaxed text-[#182230] md:text-4xl">
          {t('footer.brandStory')}
        </p>
      </div>
    </div>
  );
}

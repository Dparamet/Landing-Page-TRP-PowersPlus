'use client';

import Image from 'next/image';

import HeroContent from './HeroContent';
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage';

export default function Hero() {
  const heroImage = useHeroBackgroundImage();
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TRP Powers Plus",
    "description": "บริษัทติดตั้งระบบไฟฟ้า โซลาร์เซลล์ และประเมินหน้างานฟรี",
    "areaServed": "Thailand",
    "serviceType": "Electrical Installation"
  };

  return (
    <>
      {/* Schema Markup สำหรับ SEO */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

      <section id="hero" className="section-reveal relative z-10 flex min-h-[560px] w-full items-center justify-center overflow-visible bg-transparent px-0 py-12 sm:min-h-[620px] md:min-h-[680px] md:py-20">
        {/* Background image (DB override via hook) */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={heroImage?.src ?? '/images/hero-bg.jpg'}
            alt={heroImage?.alt ?? 'Hero background'}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover brightness-90"
          />
          {/* Blue glass overlay to sit above the image */}
          <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f2a5f]/65 via-[#0f2a5f]/45 to-[#0f2a5f]/30 mix-blend-normal" />
              <div className="absolute inset-0 bg-[color:rgba(15,42,95,0.04)]" />
          </div>
        </div>

          <HeroContent withBackgroundImage={true} />
      </section>
    </>
  );
}

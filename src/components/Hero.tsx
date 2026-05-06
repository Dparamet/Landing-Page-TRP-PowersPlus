import Image from 'next/image';
import HeroContent from './HeroContent';

export default function Hero() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <section id="hero" className="relative flex min-h-[680px] w-full items-center justify-center overflow-hidden bg-white">
        {/* Background Layer with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-solar-banner.svg"
            alt="การติดตั้งระบบโซลาร์เซลล์และไฟฟ้าโดยทีมวิศวกรผู้ชำนาญการ"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/94 via-white/88 to-[#f4f8ff]/72"></div>
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-white via-white/75 to-transparent"></div>
        </div>

        {/* Content */}
        <HeroContent />
      </section>
    </>
  );
}

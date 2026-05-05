import Link from 'next/link';
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

      <section id="hero" className="relative w-full h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Layer with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/solar-cell-installation-banner.jpg"
            alt="การติดตั้งระบบโซลาร์เซลล์และไฟฟ้าโดยทีมวิศวกรผู้ชำนาญการ"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/55"></div>
        </div>

        {/* Content */}
        <HeroContent />
      </section>
    </>
  );
}
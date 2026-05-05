import Link from 'next/link';
import Image from 'next/image';

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
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Subheading */}
          <p className="text-orange-300 text-sm md:text-base font-semibold mb-3 uppercase tracking-wider">
            โซลูชั่นพลังงานครบวงจร
          </p>

          {/* Main Heading - SEO Optimized */}
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
            ติดตั้งระบบไฟฟ้า <br className="hidden md:block"/> 
            และ<span className="text-orange-400 block md:inline"> โซลาร์เซลล์</span>
          </h1>

          {/* Subheading with Keywords */}
          <p className="text-lg md:text-2xl text-gray-100 mb-8 font-medium">
            บริษัทรับเหมาไฟฟ้า ผู้เชี่ยวชาญด้านระบบไฟฟ้าแรงสูง แรงต่ำ และพลังงานทดแทน
          </p>

          {/* Description with SEO Keywords */}
          <p className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            ยกระดับความปลอดภัยและประหยัดพลังงานในโรงแรม โรงงาน อาคารพาณิชย์ และอพยพ ด้วยทีมวิศวกรไฟฟ้าและช่างติดตั้งผู้ชำนาญการ บริการครบวงจรตั้งแต่ประเมินหน้างานจนถึงการเดินสายและทดสอบระบบ
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link 
              href="#contact" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-orange-600/50 w-full md:w-auto"
            >
              ประเมินหน้างานฟรี
            </Link>
            <Link 
              href="#services" 
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 w-full md:w-auto"
            >
              ดูบริการของเรา
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 flex flex-col md:flex-row justify-center gap-6 text-white text-sm md:text-base">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">✓</span>
              <span>ทีมวิศวกรมีประสบการณ์ 10+ ปี</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">✓</span>
              <span>รับประกันการติดตั้ง 5 ปี</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">✓</span>
              <span>ประเมินราคาฟรีไม่มีค่าใช้งาน</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
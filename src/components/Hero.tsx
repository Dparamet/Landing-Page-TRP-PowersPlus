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
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

      <section id="hero" className="section-reveal relative z-10 flex min-h-[560px] w-full items-center justify-center overflow-visible bg-transparent px-0 py-12 sm:min-h-[620px] md:min-h-[680px] md:py-20">
        <HeroContent />
      </section>
    </>
  );
}

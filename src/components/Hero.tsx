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

      <section id="hero" className="relative z-10 flex min-h-[640px] w-full items-center justify-center overflow-visible bg-transparent px-0 pb-16 pt-16 md:min-h-[680px] md:pb-20 md:pt-20">
        <HeroContent />
      </section>
    </>
  );
}

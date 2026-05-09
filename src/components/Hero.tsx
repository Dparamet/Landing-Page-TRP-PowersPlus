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

      <section id="hero" className="relative flex min-h-[720px] w-full items-center justify-center overflow-hidden bg-transparent py-20">
        <HeroContent />
      </section>
    </>
  );
}

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

      <section id="hero" className="relative flex min-h-[680px] w-full items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(240,138,36,0.15),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(30,79,143,0.12),transparent_30%),linear-gradient(135deg,#ffffff_0%,#ffffff_48%,#f4f8ff_100%)]"></div>
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgba(18,52,95,.08)_1px,transparent_1px),linear-gradient(rgba(18,52,95,.08)_1px,transparent_1px)] [background-size:56px_56px]"></div>
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-white via-white/75 to-transparent"></div>
        </div>

        <HeroContent />
      </section>
    </>
  );
}

import DetailPageHeader from '@/components/DetailPageHeader';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <DetailPageHeader
        section="services"
        title={{ th: 'บริการทั้งหมด', en: 'All Services' }}
        description={{ th: 'ดูบริการไฟฟ้า โซลาร์เซลล์ และงานดูแลระบบทั้งหมดของ TRP Powers Plus', en: 'Explore all electrical, solar, and maintenance services from TRP Powers Plus.' }}
      />
      <Services showAll />
      <Footer />
    </main>
  );
}

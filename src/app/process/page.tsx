import DetailPageHeader from '@/components/DetailPageHeader';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Process from '@/components/Process';

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <DetailPageHeader
        section="process"
        title={{ th: 'ขั้นตอนการทำงานทั้งหมด', en: 'Full Work Process' }}
        description={{ th: 'ดูขั้นตอนการทำงานตั้งแต่รับโจทย์ สำรวจหน้างาน ไปจนถึงส่งมอบระบบ', en: 'See the complete workflow from consultation and survey through delivery.' }}
      />
      <Process showAll />
      <Footer />
    </main>
  );
}

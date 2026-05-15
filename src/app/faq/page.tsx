import DetailPageHeader from '@/components/DetailPageHeader';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <DetailPageHeader
        section="faq"
        title={{ th: 'คำถามที่พบบ่อยทั้งหมด', en: 'All FAQs' }}
        description={{ th: 'รวมคำถามสำคัญก่อนตัดสินใจติดตั้งหรือปรับปรุงระบบไฟฟ้าและโซลาร์เซลล์', en: 'Key questions before installing or improving electrical and solar systems.' }}
      />
      <FAQ showAll />
      <Footer />
    </main>
  );
}

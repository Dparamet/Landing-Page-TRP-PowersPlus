import DetailPageHeader from '@/components/DetailPageHeader';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <DetailPageHeader
        section="portfolio"
        title={{ th: 'ผลงานทั้งหมด', en: 'All Portfolio' }}
        description={{ th: 'รวมตัวอย่างงานติดตั้งและระบบที่ดูแลจริง พร้อมรายละเอียดผลงาน', en: 'Browse installation and system project references with full details.' }}
      />
      <Portfolio showAll />
      <Footer />
    </main>
  );
}

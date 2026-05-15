import DetailPageHeader from '@/components/DetailPageHeader';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <DetailPageHeader
        section="contact"
        title={{ th: 'ช่องทางติดต่อทั้งหมด', en: 'All Contact Channels' }}
        description={{ th: 'เลือกช่องทางที่สะดวก นัดสำรวจหน้างาน หรือสอบถามรายละเอียดเพิ่มเติม', en: 'Choose a contact channel, schedule a survey, or ask for more details.' }}
      />
      <Contact showAll />
      <Footer />
    </main>
  );
}

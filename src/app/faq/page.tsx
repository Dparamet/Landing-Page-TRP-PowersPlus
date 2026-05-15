import BackToHome from '@/components/BackToHome';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function FaqPage() {
  return (
    <main className="site-background min-h-screen">
      <Navbar />
      <BackToHome section="faq" />
      <FAQ showAll />
      <Footer />
    </main>
  );
}

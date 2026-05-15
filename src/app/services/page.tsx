import BackToHome from '@/components/BackToHome';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';

export default function ServicesPage() {
  return (
    <main className="site-background min-h-screen">
      <Navbar />
      <BackToHome section="services" />
      <Services showAll />
      <Footer />
    </main>
  );
}

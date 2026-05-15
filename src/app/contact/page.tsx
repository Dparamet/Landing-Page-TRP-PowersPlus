import BackToHome from '@/components/BackToHome';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  return (
    <main className="site-background min-h-screen">
      <Navbar />
      <BackToHome section="contact" />
      <Contact showAll />
      <Footer />
    </main>
  );
}

import BackToHome from '@/components/BackToHome';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Process from '@/components/Process';

export default function ProcessPage() {
  return (
    <main className="site-background min-h-screen">
      <Navbar />
      <BackToHome section="process" />
      <Process showAll />
      <Footer />
    </main>
  );
}

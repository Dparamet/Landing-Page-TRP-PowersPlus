import BackToHome from '@/components/BackToHome';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';

export default function PortfolioPage() {
  return (
    <main className="site-background min-h-screen">
      <Navbar />
      <BackToHome section="portfolio" />
      <Portfolio showAll />
      <Footer />
    </main>
  );
}

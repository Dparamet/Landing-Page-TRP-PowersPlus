import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import ServiceSelector from "../components/ServiceSelector";
import SolarCalculator from "../components/SolarCalculator";
import Portfolio from "../components/Portfolio";
import Process from "../components/Process";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="site-background min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <ServiceSelector />
      <SolarCalculator />
      <Portfolio />
      <Process />
      <Contact />
      <FAQ />
      <Footer />
    </main>
  );
}

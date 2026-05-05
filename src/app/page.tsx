// ใส่แก๊ง Import พวกนี้ไว้บนสุดของไฟล์เลยนะ
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Portfolio from "../components/Portfolio";
import SolarCalculator from "../components/SolarCalculator";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Portfolio />
      <SolarCalculator /> 
      <Contact />
    </main>
  );
}
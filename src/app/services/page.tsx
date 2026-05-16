'use client';

import { motion } from 'motion/react';
import DetailPageHeader from '@/components/DetailPageHeader';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import PageLayout from '@/components/PageLayout';

export default function ServicesPage() {
  return (
    <PageLayout className="bg-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DetailPageHeader
          section="services"
          title={{ th: 'บริการทั้งหมด', en: 'All Services' }}
          description={{ th: 'ดูบริการไฟฟ้า โซลาร์เซลล์ และงานดูแลระบบทั้งหมดของ TRP Powers Plus', en: 'Explore all electrical, solar, and maintenance services from TRP Powers Plus.' }}
        />
      </motion.div>

      {/* Services section with staggered animations */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <Services showAll />
      </motion.div>

      <Footer />
    </PageLayout>
  );
}

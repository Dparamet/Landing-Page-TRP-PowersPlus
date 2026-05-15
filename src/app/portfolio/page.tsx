'use client';

import { motion } from 'motion/react';
import DetailPageHeader from '@/components/DetailPageHeader';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';
import PageLayout from '@/components/PageLayout';

export default function PortfolioPage() {
  return (
    <PageLayout className="bg-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DetailPageHeader
          section="portfolio"
          title={{ th: 'ผลงานทั้งหมด', en: 'All Portfolio' }}
          description={{ th: 'รวมตัวอย่างงานติดตั้งและระบบที่ดูแลจริง พร้อมรายละเอียดผลงาน', en: 'Browse installation and system project references with full details.' }}
        />
      </motion.div>

      {/* Portfolio section with smooth reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <Portfolio showAll />
      </motion.div>

      <Footer />
    </PageLayout>
  );
}

'use client';

import { motion } from 'motion/react';
import DetailPageHeader from '@/components/DetailPageHeader';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import PageLayout from '@/components/PageLayout';

export default function FaqPage() {
  return (
    <PageLayout className="bg-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DetailPageHeader
          section="faq"
          title={{ th: 'คำถามที่พบบ่อยทั้งหมด', en: 'All FAQs' }}
          description={{ th: 'รวมคำถามสำคัญก่อนตัดสินใจติดตั้งหรือปรับปรุงระบบไฟฟ้าและโซลาร์เซลล์', en: 'Key questions before installing or improving electrical and solar systems.' }}
        />
      </motion.div>

      {/* FAQ section with smooth reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <FAQ showAll />
      </motion.div>

      <Footer />
    </PageLayout>
  );
}

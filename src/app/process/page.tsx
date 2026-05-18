'use client';

import { motion } from 'motion/react';
import DetailPageHeader from '@/components/DetailPageHeader';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Process from '@/components/Process';
import PageLayout from '@/components/PageLayout';

export default function ProcessPage() {
  return (
    <PageLayout className="bg-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DetailPageHeader
          section="process"
          title={{ th: 'ขั้นตอนการทำงานทั้งหมด', en: 'Full Work Process' }}
          description={{ th: 'ดูขั้นตอนการทำงานตั้งแต่รับโจทย์ สำรวจหน้างาน ไปจนถึงส่งมอบระบบ', en: 'See the complete workflow from consultation and survey through delivery.' }}
        />
      </motion.div>

      {/* Process section with smooth reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <Process showAll />
      </motion.div>

      <Footer />
    </PageLayout>
  );
}

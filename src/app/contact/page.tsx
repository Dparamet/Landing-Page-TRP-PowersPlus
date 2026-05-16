'use client';

import { motion } from 'motion/react';
import DetailPageHeader from '@/components/DetailPageHeader';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import PageLayout from '@/components/PageLayout';

export default function ContactPage() {
  return (
    <PageLayout className="bg-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DetailPageHeader
          section="contact"
          title={{ th: 'ช่องทางติดต่อทั้งหมด', en: 'All Contact Channels' }}
          description={{ th: 'เลือกช่องทางที่สะดวก นัดสำรวจหน้างาน หรือสอบถามรายละเอียดเพิ่มเติม', en: 'Choose a contact channel, schedule a survey, or ask for more details.' }}
        />
      </motion.div>

      {/* Contact section with smooth reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <Contact showAll />
      </motion.div>

      <Footer />
    </PageLayout>
  );
}

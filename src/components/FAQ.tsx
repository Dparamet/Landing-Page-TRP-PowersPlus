'use client';

import { useState } from 'react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'ต้องใช้เวลานานแค่ไหนสำหรับการติดตั้งโซลาร์เซลล์?',
      answer: 'ระยะเวลาการติดตั้งขึ้นอยู่กับขนาดของระบบ โดยทั่วไปการติดตั้งใช้เวลา 3-7 วัน สำหรับระบบขนาดกลาง นอกจากนี้เรายังมีขั้นตอนตรวจสอบและทดสอบอย่างละเอียด'
    },
    {
      question: 'ประกันสินค้าและการติดตั้งนานเท่าไหร่?',
      answer: 'เรามีการรับประกัน 5 ปีสำหรับการติดตั้งและงานวิศวกรรม และสินค้าโซลาร์เซลล์มีการรับประกัน 25-30 ปี นอกจากนี้เรายังให้บริการซ่อมบำรุงตลอดชีวิตของระบบ'
    },
    {
      question: 'ราคาการติดตั้งเท่าไหร่ และมีเงื่อนไขอะไรบ้าง?',
      answer: 'ราคาขึ้นอยู่กับขนาดของระบบ และจำนวนแผงโซลาร์เซลล์ที่ต้องการ เราให้บริการประเมินหน้างานฟรี โดยสามารถให้ใบเสนอราคาที่แน่นอนหลังจากตรวจสอบสภาพอาคารเรียบร้อยแล้ว'
    },
    {
      question: 'ระบบโซลาร์เซลล์ต้องการการบำรุงรักษาหรือไม่?',
      answer: 'ระบบโซลาร์เซลล์ต้องการการดูแลเพียงเล็กน้อย เช่น การทำความสะอาดแผงเป็นครั้งคราว เรามีบริการดูแลรักษาประจำปีที่ราคาไม่แพง'
    },
    {
      question: 'สามารถลดค่าไฟของบ้านได้มากแค่ไหน?',
      answer: 'การลดค่าไฟขึ้นอยู่กับการใช้พลังงาน ขนาดระบบ และสภาพอากาศในพื้นที่ โดยทั่วไปลูกค้าของเรามีค่าไฟลดลง 50-80% ตามการออกแบบระบบ'
    },
    {
      question: 'ทำไมต้องเลือก TRP Powers Plus?',
      answer: 'เรามีประสบการณ์กว่า 10 ปี ในการติดตั้งระบบไฟฟ้าและโซลาร์เซลล์ ทีมของเราประกอบด้วยวิศวกรและช่างผู้ชำนาญการที่ได้รับการรับรองสากล ให้บริการฉันทนะสูง และดูแลรักษาหลังการติดตั้งอย่างยาวนาน'
    },
    {
      question: 'มีตัวอย่างผลงานของเราไหม?',
      answer: 'ใช่แน่นอน! เรามีผลงานมากกว่า 500 โครงการที่สมบูรณ์แล้ว จากบ้านเดี่ยว ท่าเรือ ไปจนถึงอาคารสูง คุณสามารถดูผลงานของเราในหน้า "ผลงาน" ของเว็บไซต์นี้'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ยังไม่ได้ติดสินใจ?
          </h2>
          <p className="text-gray-600 text-lg">
            คิดอยากเรียนรู้เพิ่มเติมเกี่ยวกับการประเมินราคาฟรี และบริการของเรา? ตรวจสอบคำถามที่บ่อยสุดได้ที่นี่
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
            >
              {/* Question Button */}
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
              >
                <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                <span
                  className={`text-orange-600 text-2xl transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {/* Answer */}
              {activeIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            ยังมีคำถามอื่นๆ หรือต้องการประเมินราคา?
          </p>
          <a
            href="#contact"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold transition-colors"
          >
            โทรประเมินหน้างานฟรี
          </a>
        </div>
      </div>
    </section>
  );
}

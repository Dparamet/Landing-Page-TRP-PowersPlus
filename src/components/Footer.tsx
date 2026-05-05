import Link from 'next/link';
import FooterContent from './FooterContent';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <FooterContent />

      {/* Copyright Bar */}
      <div className="bg-gray-950 px-4 py-6 text-center text-sm">
        <p className="text-gray-400">
          © {currentYear} <span className="text-orange-500 font-bold">TRP Powers Plus</span>. สงวนลิขสิทธิ์ทั้งหมด | บริษัท TRP Powers Plus จำกัด
        </p>
        <p className="text-gray-500 text-xs mt-2">
          การติดตั้งระบบไฟฟ้าและโซลาร์เซลล์ | ให้คำปรึกษาฟรี | บริการครบวงจร
        </p>
      </div>
    </footer>
  );
}

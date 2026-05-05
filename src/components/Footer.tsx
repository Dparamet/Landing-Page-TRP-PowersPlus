import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TRP Powers Plus</h3>
            <p className="text-sm leading-relaxed">
              บริษัทรับเหมาไฟฟ้า ติดตั้งโซลาร์เซลล์ และให้บริการด้านพลังงานทดแทนอย่างมืออาชีพ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">เมนู</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#hero" className="hover:text-orange-500 transition">หน้าแรก</Link></li>
              <li><Link href="#services" className="hover:text-orange-500 transition">บริการ</Link></li>
              <li><Link href="#portfolio" className="hover:text-orange-500 transition">ผลงาน</Link></li>
              <li><Link href="#contact" className="hover:text-orange-500 transition">ติดต่อเรา</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4">บริการ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition">ติดตั้งไฟฟ้า</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">โซลาร์เซลล์</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">บำรุงรักษา</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">ปรึกษาฟรี</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+66012345678" className="hover:text-orange-500 transition">📞 +66 (0) 12-345-6789</a></li>
              <li><a href="mailto:TRPPowersplus@gmail.com" className="hover:text-orange-500 transition">✉️ TRPPowersplus@gmail.com</a></li>
              <li><a href="https://facebook.com/TRPPowersplus" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">📘 Facebook</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8"></div>
      </div>

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

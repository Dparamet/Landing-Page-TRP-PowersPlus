import Link from 'next/link';

export default function Navbar() {
  return (
    // sticky top-0 ทำให้เมนูลอยติดขอบจอบนเวลาเลื่อนลง z-50 กันโดนส่วนอื่นทับ
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. โลโก้ (เดี๋ยวเราค่อยเอารูปจาก Figma มาใส่ทีหลัง) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              TRP POWERS<span className="text-orange-500">PLUS</span>
            </Link>
          </div>

          {/* 2. เมนูตรงกลาง (ซ่อนไว้ก่อนถ้าเปิดในมือถือ) */}
          <div className="hidden md:flex space-x-8">
            <Link href="#services" className="text-gray-700 hover:text-orange-500 transition-colors">
              บริการของเรา
            </Link>
            <Link href="#portfolio" className="text-gray-700 hover:text-orange-500 transition-colors">
              ผลงาน
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-orange-500 transition-colors">
              ติดต่อเรา
            </Link>
          </div>

          {/* 3. ปุ่ม Call to Action ดึงดูดลูกค้า */}
          <div className="hidden md:flex items-center">
            <a 
              href="#contact" 
              className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600 transition-all shadow-sm"
            >
              ประเมินราคาฟรี
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}
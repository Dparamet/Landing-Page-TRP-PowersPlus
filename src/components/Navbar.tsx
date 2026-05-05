import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex h-20 w-full items-center bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6">
        
        {/* โลโก้: วางให้กึ่งกลางในแถบ nav และไม่สูงเกินไป */}
        <Link href="/" className="relative flex h-12 w-44 shrink-0 items-center md:h-14 md:w-52"> 
          <Image 
            src="/images/LogoTRP.png" 
            alt="TRP Powers Plus" 
            fill 
            className="object-contain"
            priority 
          />
        </Link>

        {/* เมนู: คงระยะห่างให้สมดุลกับโลโก้ */}
        <div className="hidden items-center gap-12 text-lg font-bold text-gray-800 md:flex">
          <Link href="#hero" className="hover:text-blue-600 transition">หน้าแรก</Link>
          <Link href="#portfolio" className="hover:text-blue-600 transition">ผลงาน</Link>
          <Link href="#calculator" className="hover:text-blue-600 transition">คำนวณราคา</Link>
          <Link href="#contact" className="hover:text-blue-600 transition">ติดต่อเรา</Link>
        </div>

      </div>
    </nav>
  );
}
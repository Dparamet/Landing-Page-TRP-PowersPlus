import Link from 'next/link';

export default function Hero() {
  return (
    // ใช้ bg-slate-800 แทนรูปภาพไปก่อน โครงสร้างจะได้ไม่พัง
    <section className="relative w-full h-[600px] flex items-center justify-center bg-slate-800">
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          ผู้เชี่ยวชาญด้านระบบไฟฟ้า <br className="hidden md:block"/> 
          และพลังงาน <span className="text-orange-500">โซลาร์เซลล์</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          ยกระดับความปลอดภัยและประหยัดพลังงาน ด้วยทีมวิศวกรและช่างผู้ชำนาญการ
        </p>
        <Link href="#contact" className="bg-orange-500 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-orange-600 transition-all">
          ประเมินหน้างาน ฟรี!
        </Link>
      </div>
    </section>
  );
}
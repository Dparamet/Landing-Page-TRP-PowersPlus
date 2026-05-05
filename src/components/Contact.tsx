export default function Contact() {
  return (
    <section id="contact" className="pt-20 bg-gray-50 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 w-full mb-20">
        <h2 className="text-4xl font-bold text-center text-orange-500 mb-12">Contact Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* ฝั่งซ้าย: ข้อมูลติดต่อ (MVP ใส่เป็นกล่องเทาแทน Icon ไปก่อน) */}
          <div className="space-y-6 text-gray-700">
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-orange-400 rounded-full"></div><p>+66 (0) 12-345-6789</p></div>
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-orange-400 rounded-full"></div><p>facebook.com/TRPPowersplus</p></div>
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-orange-400 rounded-full"></div><p>@TRPPowersplus</p></div>
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-orange-400 rounded-full"></div><p>TRPPowersplus@gmail.com</p></div>
            <div className="flex items-start gap-4"><div className="w-10 h-10 bg-orange-400 rounded-full shrink-0"></div><p>123 Solar Street, Green Energy District<br/>Bangkok 10500, Thailand</p></div>
          </div>

          {/* ฝั่งขวา: แผนที่ Google Map (MVP ใส่เป็นกล่องเทา) */}
          <div className="w-full h-[300px] bg-gray-300 rounded-xl shadow-inner"></div>
        </div>
      </div>

      {/* Footer ชั้นล่างสุด */}
      <footer className="w-full text-center">
        <div className="py-12 px-4 bg-gray-100 flex flex-col items-center">
           <div className="w-40 h-16 bg-gray-300 rounded-md mb-6"></div> {/* โลโก้ Footer */}
           <p className="max-w-2xl text-gray-500 text-sm">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laborum vero ad ducimus explicabo...
           </p>
        </div>
        <div className="bg-blue-600 text-white py-4 text-sm">
          © 2026 SolarPro - Professional Solar Cell Installation Services. All rights reserved.
        </div>
      </footer>
    </section>
  );
}
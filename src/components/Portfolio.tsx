export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* ซ่อนหัวข้อไว้ก่อน เพราะใน Figma ไม่มีเขียนหัวข้อชัดเจน แต่เผื่อไว้เพื่อ SEO */}
        <h2 className="sr-only">ผลงานของเรา (Portfolio)</h2> 
        
        {/* Grid 2x2 รองรับมือถือเป็น 1 แถว */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            // กล่องเทาแทนรูปภาพ (อัตราส่วน 16:9)
            <div key={item} className="aspect-video bg-gray-300 rounded-xl shadow-md w-full"></div>
          ))}
        </div>
      </div>
    </section>
  );
}
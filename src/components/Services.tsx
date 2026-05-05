export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-12">บริการของเรา</h2>
        
        {/* สร้างกล่อง Grid 3 ช่อง แทนรูปและเนื้อหาบริการ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-6 border rounded-lg shadow-sm">
              {/* กล่องสีเทาแทนรูปภาพ/ไอคอน MVP */}
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold mb-2">บริการที่ {item}</h3>
              <p className="text-gray-600">รายละเอียดบริการแบบย่อ...</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
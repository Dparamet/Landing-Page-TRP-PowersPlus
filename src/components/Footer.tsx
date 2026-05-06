import FooterContent from './FooterContent';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-700">
      <FooterContent />

      {/* Copyright Bar */}
      <div className="border-t border-orange-100 bg-white px-4 py-6 text-center text-sm">
        <p className="text-slate-600">
          © {currentYear} <span className="font-bold text-[#12345f]">TRP Powers Plus</span>. สงวนลิขสิทธิ์ทั้งหมด | บริษัท TRP Powers Plus จำกัด
        </p>
        <p className="mt-2 text-xs text-slate-500">
          การติดตั้งระบบไฟฟ้าและโซลาร์เซลล์ | ให้คำปรึกษาฟรี | บริการครบวงจร
        </p>
      </div>
    </footer>
  );
}

const phraseMap = {
  บ้านพักอาศัย: 'Residential',
  อาคารสำนักงาน: 'Office building',
  โรงงาน: 'Factory',
  โซลาร์เซลล์: 'Solar',
  ตรวจสอบระบบ: 'Inspection',
  ตู้ควบคุม: 'Control panel',
  ขอบเขตงาน: 'Scope',
  ขนาดระบบ: 'System size',
  พื้นที่: 'Area',
  ก่อนติดตั้ง: 'Before installation',
  ระหว่างติดตั้ง: 'During installation',
  หลังติดตั้ง: 'After installation',
  ชื่อบริษัท: 'Company',
  เบอร์โทรศัพท์: 'Phone',
  อีเมล: 'Email',
  ที่อยู่: 'Address',
};

const wordMap = {
  บริการ: 'service',
  ระบบ: 'system',
  ไฟฟ้า: 'electrical',
  บ้าน: 'home',
  อาคาร: 'building',
  สำนักงาน: 'office',
  โรงงาน: 'factory',
  โซลาร์: 'solar',
  โซลาร์เซลล์: 'solar',
  ตรวจสอบ: 'inspect',
  บำรุงรักษา: 'maintenance',
  ติดตั้ง: 'install',
  ซ่อม: 'repair',
  ปรับปรุง: 'upgrade',
  เดินสาย: 'wiring',
  ตู้ไฟ: 'panel',
  โหลดไฟ: 'load',
  ข้อมูล: 'information',
  เตรียม: 'prepare',
  ราคา: 'price',
  ประเมิน: 'estimate',
  รายงาน: 'report',
  ผลงาน: 'project',
  ติดต่อ: 'contact',
};

export function fillEnglish(thaiText, englishText) {
  const trimmedEnglish = englishText.trim();
  if (trimmedEnglish) return trimmedEnglish;

  const trimmedThai = thaiText.trim();
  if (!trimmedThai) return '';
  if (phraseMap[trimmedThai]) return phraseMap[trimmedThai];

  let translated = trimmedThai;
  for (const [thai, english] of Object.entries(wordMap)) {
    translated = translated.replaceAll(thai, english);
  }

  return translated === trimmedThai ? trimmedThai : translated;
}

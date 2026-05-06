/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // เพิ่มบรรทัดนี้
  images: {
    unoptimized: true, // GitHub Pages ไม่รองรับ Image Optimization ของ Next.js
  },
}
export default nextConfig
// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ClientLayout } from "./ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://trppowersplus.com"),
  title: "TRP Powers Plus | บริษัทติดตั้งระบบไฟฟ้า โซลาร์เซลล์ รับเหมาครบวงจร",
  description: "บริษัทติดตั้งระบบไฟฟ้า โซลาร์เซลล์ และพลังงานทดแทน โดยวิศวกรผู้ชำนาญการ ประเมินหน้างานฟรี รับประกัน 5 ปี",
  keywords: "ติดตั้งไฟฟ้า,โซลาร์เซลล์,รับเหมาไฟฟ้า,วิศวกรไฟฟ้า,ประเมินหน้างาน,ระบบไฟฟ้า,โซลูชั่นพลังงาน",
  openGraph: {
    title: "TRP Powers Plus - บริษัทติดตั้งระบบไฟฟ้าและโซลาร์เซลล์",
    description: "บริการติดตั้งระบบไฟฟ้า โซลาร์เซลล์ ประเมินราคาฟรี รับประกัน 5 ปี",
    type: "website",
    locale: "th_TH",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://trppowersplus.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f08a24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className="bg-white text-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
